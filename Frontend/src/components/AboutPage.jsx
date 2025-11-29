import React from 'react';
import { Users, Heart, Target, Award } from 'lucide-react';
import Navbar from './Navbar/Navbar';

const AboutPage = () => {
//   const stats = [
//     { icon: Users, number: "50,000+", label: "Lives Impacted" },
//     { icon: Heart, number: "1,200+", label: "Active Donors" },
//     { icon: Target, number: "95%", label: "Success Rate" },
//     { icon: Award, number: "15+", label: "Years Experience" }
//   ];



  return (
    <>
    <Navbar/>
    <div className=" min-h-screen">
      {/* Hero Section */}
      <section className=" bg-ble-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Himalaya Fund</h1>
          <p className="text-2xl">
            Empowering Himalayan communities through sustainable development
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-white text-m leading-relaxed">
                To empower remote Himalayan communities by providing sustainable solutions in education, 
                healthcare, and infrastructure while preserving their rich cultural heritage.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-white text-m leading-relaxed">
                A future where all Himalayan communities thrive with dignity, equipped with the resources 
                they need to build sustainable livelihoods while maintaining their cultural identity.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Our Story */}
      <section className="py-16 bg-bue-800 ">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-4 leading-relaxed">
          <p className=' text-lg'>
  <strong>Himalaya Fund was founded</strong> out of a lifelong desire to help those in need, shaped by the realities I witnessed growing up in Nepal. From a young age, I was deeply moved by the struggles faced by people in my community—families living in remote regions with limited access to education, healthcare, and basic resources. Even as a child, I felt a strong urge to help, to give, and to make a meaningful difference.
</p>

<p className=' text-lg'>
  Over the years, I observed how, in times of hardship, communities in Nepal relied on heartfelt, traditional ways of raising support—going door to door, organizing local events, and spreading the word through tight-knit networks. These efforts, though inspiring, were often slow and struggled to reach a wider audience or make a lasting impact.
</p>

<p className=' text-lg'>
  That’s how <strong>Himalaya Fund</strong> came to life—a platform born in Nepal, for Nepal and beyond. It was created to bridge the gap between traditional fundraising and the opportunities offered by modern technology. It’s a space where anyone can raise or contribute funds for causes that matter—medical emergencies, education, community development, and more.
</p>

<p className=' text-lg'>
  Himalaya Fund is not just a website—it’s a mission. It’s built on trust, transparency, and compassion, empowering individuals and communities to support one another and create lasting, meaningful change.
</p>

<p className=' text-lg'>
  Today, Himalaya Fund stands as a beacon of hope—connecting those with the heart to give and those in urgent need. Whether you’re launching a campaign or supporting one, you’re becoming part of a powerful movement to uplift lives across the Himalayan region and beyond.
</p>


          </div>
        </div>
      </section>

      

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <Heart size={40} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Compassion</h3>
              <p className="text-gray-600 text-sm">
                We approach every project with genuine care for the communities we serve.
              </p>
            </div>
            <div className="text-center p-6">
              <Target size={40} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                Our solutions create lasting change that communities can maintain independently.
              </p>
            </div>
            <div className="text-center p-6">
              <Users size={40} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Partnership</h3>
              <p className="text-gray-600 text-sm">
                We work with local communities, respecting their wisdom and cultural values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-blue-100 mb-6">
            Join us in our mission to empower Himalayan communities and create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white border-2 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:text-white">
              Start a Campaign
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              Volunteer with Us
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AboutPage;