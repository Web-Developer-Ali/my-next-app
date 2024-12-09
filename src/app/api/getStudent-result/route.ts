import { NextRequest, NextResponse } from 'next/server';
import StudentResults from '@/model/StudentResults';
import NodeCache from 'node-cache';
import dbConnection from '@/lib/dbConnect';

// Initialize in-memory cache
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Rate limiting setup
const requestCount: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT = 8; // Max 20 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Rate Limiting function
const isRateLimited = (ip: string): boolean => {
  const currentTime = Date.now();
  const userData = requestCount[ip] || { count: 0, timestamp: currentTime };

  if (currentTime - userData.timestamp > RATE_LIMIT_WINDOW) {
    userData.count = 0;
    userData.timestamp = currentTime;
  }

  userData.count++;
  requestCount[ip] = userData;

  return userData.count > RATE_LIMIT;
};

export async function POST(request: NextRequest) {
  await dbConnection();

  const ip = request.ip || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  try {
    const { rollNumber, name } = await request.json();

    if (!rollNumber || !name) {
      return NextResponse.json({ message: 'Both roll number and name are required' }, { status: 400 });
    }

    const cacheKey = `result:${rollNumber}:${name}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const student = await StudentResults.findOne({
      rollNumber: rollNumber.trim(),
      name: name.trim()
    }).lean().exec();

    if (!student) {
      return NextResponse.json({ message: 'No student found with matching roll number and name' }, { status: 404 });
    }

    cache.set(cacheKey, { student });

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}