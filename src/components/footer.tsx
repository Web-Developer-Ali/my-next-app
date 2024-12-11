import { Facebook, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Us Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">CONTACT US</h3>
            <div className="space-y-2">
              <p>Shah Abdul Latif University, Khairpur</p>
              <div className="text-gray-300">
                <p>Mailing address:</p>
                <p>Old National Highway,</p>
                <p>Khairpur Mir&apos;s, 66020 Sindh, Pakistan.</p>
              </div>
            </div>
          </div>

          {/* Favourites Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">FAVOURITES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Directorate of Student Affairs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Directorate of Evening Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Directorate of PGS
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Distance Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">RESOURCES FOR</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Sports Section
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Quality Enhancement
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Forms Downloads
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Tenders
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Prospectus
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Alumni
                </Link>
              </li>
            </ul>
          </div>

          {/* Study Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">STUDY</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Admissions @ SALU
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Examinations & Results
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Digital Library Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-end mt-8 space-x-4">
          <Link href="#" className="text-white hover:text-blue-200">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-white hover:text-blue-200">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-white hover:text-blue-200">
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

