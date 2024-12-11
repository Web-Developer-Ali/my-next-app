import image from "@/../../public/image.jpg"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8"> 
        <Image
          src={image}
          alt="University Campus"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover mb-8"
          priority
        />

        {/* Right Column - Vice Chancellor's Message */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-4"> {/* Updated h2 size */}
          VICE CHANCELLOR&apos;S MESSAGE
        </h2>
        <div className="prose max-w-none"> {/* Removed flex container and added max-w-none */}
          <p className="text-gray-600 leading-relaxed">
            Welcome to Shah Abdul Latif University, Khairpur! As the premier institution 
            of higher education in Upper Sindh, our university stands at the forefront 
            of academic and research excellence, serving as a beacon of knowledge for 
            students across the region. With 29 departments and institutes spread across 
            seven faculties, we offer a diverse range of programs that cater to your 
            academic and professional aspirations.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our university is not just an institution, but a community that nurtures 
            the intellect and hones the skills of its students, preparing them for 
            the challenges of the modern world. Our two campuses in Shehdadkot and 
            Ghotki extend our reach to the borders of Punjab and Balochistan, ensuring 
            that we remain a vital academic hub for the region.
          </p>
        </div>
      </div>
    </div>
  )
}

