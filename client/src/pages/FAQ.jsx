import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    category: 'For Donors',
    emoji: '🤝',
    questions: [
      { q: 'Who can donate food?', a: 'Anyone! Restaurants, bakeries, grocery stores, caterers, hotels, and individuals with surplus home-cooked food can all donate on FoodShare. If you have excess food that\'s still safe to eat, we want to help you share it.' },
      { q: 'What types of food can I donate?', a: 'We accept cooked meals, fresh produce, baked goods, canned and packaged foods, dairy products, and beverages. Food must be safe for consumption and properly stored. We do not accept food that is expired, spoiled, or has been partially eaten.' },
      { q: 'Can I edit or cancel my donation?', a: 'Yes! You can edit or delete a donation as long as it has not been claimed by a recipient. Once claimed, the donation is in progress and cannot be edited. You can still cancel through the admin if needed.' },
      { q: 'How does volunteer delivery work?', a: 'When you select "Volunteer Delivery" as your delivery mode, a volunteer from our network will see the pickup task and accept it. They\'ll collect the food from your location and deliver it to the recipient\'s address. You\'ll be notified at each step.' },
    ]
  },
  {
    category: 'For Recipients',
    emoji: '🙏',
    questions: [
      { q: 'Is the food safe to eat?', a: 'Donors are required to confirm that food is fresh, properly stored, and safe for consumption. We also display preparation and expiry times for each donation. If you ever receive food that seems unsafe, please report it immediately.' },
      { q: 'How do I claim a donation?', a: 'Browse available donations, click on one you want, and click the "Claim" button. You\'ll need to be logged in as a recipient. Once claimed, you\'ll receive details about pickup or delivery, depending on the donation mode.' },
      { q: 'Can I request specific food items?', a: 'Yes! Use the "Request Food" feature to submit a specific food request. Donors can see your request and may create a matching donation. This is especially helpful for shelters and community organizations with regular needs.' },
      { q: 'Is there any cost to receive food?', a: 'No. FoodShare is completely free for recipients. We are a community platform dedicated to reducing waste and fighting hunger. There are no fees, no subscriptions, and no hidden costs.' },
    ]
  },
  {
    category: 'For Volunteers',
    emoji: '🚴',
    questions: [
      { q: 'What does a volunteer do?', a: 'Volunteers pick up food from donors and deliver it to recipients. You can choose tasks near you, set your own schedule, and make a direct impact in your community. You only accept tasks when you\'re available.' },
      { q: 'Do I need a vehicle?', a: 'Not necessarily. For small deliveries like bread or produce, a bicycle or even walking works fine. For larger donations like cooked meals for a shelter, a car or bike with cargo capacity is recommended. You can see the quantity before accepting a task.' },
      { q: 'Is volunteering safe?', a: 'We take safety seriously. Volunteer contact information is only shared with the relevant donor and recipient. All users on FoodShare are registered and verified. You can report any concerns through the platform.' },
    ]
  },
  {
    category: 'General',
    emoji: '❓',
    questions: [
      { q: 'Is FoodShare free to use?', a: 'Yes, FoodShare is completely free for all users — donors, recipients, and volunteers. We\'re a community-driven platform focused on impact, not profit.' },
      { q: 'How is my data protected?', a: 'Your personal information is securely stored and never sold to third parties. Sensitive information like phone numbers is only shared with relevant parties during an active donation transaction.' },
      { q: 'Can organizations join FoodShare?', a: 'Absolutely! NGOs, shelters, food banks, and community organizations are welcome to register as recipients or partners. Contact us for bulk access and organizational features.' },
    ]
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">❓</div>
            <h1 className="font-display text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-300 text-xl">Everything you need to know about using FoodShare</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqs.map((section, i) => (
          <motion.div key={section.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>{section.emoji}</span> {section.category}
            </h2>
            <div className="space-y-3">
              {section.questions.map(faq => (
                <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </motion.div>
        ))}

        <div className="text-center bg-primary-50 rounded-2xl p-8 border border-primary-100">
          <HelpCircle size={32} className="text-primary-600 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Can't find what you're looking for? Our team is happy to help.</p>
          <Link to="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  )
}
