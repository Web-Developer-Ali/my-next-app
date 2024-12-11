import Image from 'next/image'
import campus from "@/../../public/campus-image.jpg"
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-8 text-center">About Shah Abdul Latif University</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <Image
              src={campus}
              alt="Shah Abdul Latif University Campus"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Shah Abdul Latif University, Khairpur provides unique opportunities to students in the fields of Natural Sciences, Physical Sciences, Social Sciences, Arts & Languages, Education, Management Sciences and Law. It is the only University in Upper Sindh catering to various academic disciplines.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              As one of Pakistan&apos;s developed universities, it boasts over 234 well-qualified faculty members across 29 departments. The majority of our faculty is young and foreign-qualified, employing innovative teaching methods backed by state-of-the-art audio-visual tools.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our goal is to prepare students for the competitive market, resulting in many of our graduates securing professional positions.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Location</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Shah Abdul Latif University is located in Khairpur, the heartland of Upper Sindh. The main campus is situated near the National Highway, easily accessible by air, railway, and bus services. Sukkur airport is a half-hour drive away, and Khairpur Railway station is just 5 kilometers from the main campus.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The University is surrounded by famous archaeological sites such as Mohenjo Daro, Kot Diji, Rohri Hills, and Achro Desert. Religious shrines like Sadhu Bella and Sachal Sarmast, as well as the Lloyds Barrage and Lansdowne and Ayoub Bridges, add to the rich cultural landscape of the area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Campus</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Covers an area of 302-22 acres</li>
              <li>Features lush green lawns, playgrounds, and trees</li>
              <li>Located just three kilometers from Khairpur town</li>
              <li>Three canals at walking distance serve as picnic spots</li>
              <li>Eight hostels, including three for female students</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Student Body</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Over 13,000 students in various programs</li>
              <li>Approximately 70% male students</li>
              <li>Approximately 30% female students</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

