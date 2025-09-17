import Link from 'next/link';

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'General Questions',
      faqs: [
        {
          question: 'What is Ventaro AI?',
          answer: 'Ventaro AI is a Melbourne-based company founded in March 2025, specializing in AI-powered business solutions and digital products. We help individuals and businesses adapt quickly to the AI revolution by providing comprehensive coaching, masterclasses, toolkits, and web development services. We serve as the bridge to help you leverage AI technology effectively for business growth.'
        },
        {
          question: 'Do I need to create an account to make a purchase?',
          answer: 'Yes, you need to create an account to make purchases. This allows us to securely store your purchase history and provide you with access to your digital downloads at any time.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our customer support team through our Contact page or by emailing chris.t@ventarosales.com. We typically respond within 24 hours during business days.'
        }
      ]
    },
    {
      title: 'Products & Usage',
      faqs: [
        {
          question: 'What types of products do you offer?',
          answer: 'We offer four main services: VAI Coaching (personalized AI business coaching sessions), VAI Masterclass (comprehensive video tutorials and step-by-step guides), VAI Toolkit (curated collection of AI tools and prompts), and VAI Web Gen (custom AI-powered website development). All our products are designed to help you succeed in the AI-driven business landscape.'
        },
        {
          question: 'Are there any usage restrictions?',
          answer: 'Our digital products are for personal use only. Please refer to the specific details included with each product for complete information.'
        },
        {
          question: 'Do you offer customization services for your products?',
          answer: 'We dont currently offer customization services for our standard products. However, our coaching calls provide personalized guidance tailored to your specific needs.'
        }
      ]
    },
    {
      title: 'Purchases & Downloads',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay for secure and convenient transactions.'
        },
        {
          question: 'How do I download my purchased digital products?',
          answer: 'After completing your purchase of digital products (VAI Toolkit and VAI Masterclass materials), you will receive an email with instructions. You can also access your products via the accounts page at any time by logging into your account. For VAI Coaching sessions, we will be in touch to organize a suitable time.'
        },
        {
          question: 'How long do I have access to my purchased digital products?',
          answer: 'You have lifetime access to all purchased digital products. You can download them as many times as you need from your my-account page.'
        },
        {
          question: 'What is the download process for digital products?',
          answer: 'Our digital products (VAI Toolkit and VAI Masterclass materials) are available for immediate download after purchase. Simply click the download link in your confirmation email or access them from your account dashboard. Files are typically provided in PDF format for guides and various formats for tools and resources.'
        },
        {
          question: 'Are my payment details secure?',
          answer: 'Absolutely. We use Stripe, a PCI-compliant payment processor, to handle all transactions. Your payment information is encrypted and never stored on our servers.'
        },
        {
          question: 'Do you offer shipping?',
          answer: 'No, we do not offer physical shipping as we are a 100% digital business. All products are delivered instantly via digital download after purchase, except for AI Business Strategy Sessions which are scheduled separately.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'Do you offer refunds?',
          answer: 'Due to the digital nature of our products, we do not offer refunds under any circumstances once a product has been purchased and delivered. Please review our Terms & Conditions page for our complete refund policy.'
        },
        {
          question: 'What if the product doesn\'t work as described?',
          answer: 'If you encounter any issues with a product not functioning as described, please contact our support team. While we dont offer refunds, we will work with you to resolve any technical issues or provide additional support.'
        }
      ]
    },
    {
      title: 'Custom Web Development',
      faqs: [
        {
          question: 'What is your payment structure for custom web development?',
          answer: 'Our custom web development projects require a 50% upfront payment to begin work, with the remaining 50% due upon project completion and delivery. All payments are final and non-refundable once work has commenced.'
        },
        {
          question: 'Do you offer refunds on upfront payments for web development?',
          answer: 'No, all upfront payments for custom web development projects are final and non-refundable once project work has begun. This policy ensures we can dedicate our resources to delivering your project.'
        },
        {
          question: 'What is your 21-day delivery guarantee?',
          answer: 'We guarantee to deliver your complete website within 21 days from order confirmation. If your project is not completed within 21 days, we continue building but only keep the 50% upfront payment - no additional charges will apply.'
        },
        {
          question: 'What happens if I\'m not satisfied with the final result?',
          answer: 'We include unlimited revisions during the development process to ensure your satisfaction. However, all payments remain final regardless of project outcome. We work closely with clients throughout the process to meet expectations.'
        }
      ]
    },
    {
      title: 'Technical Support',
      faqs: [
        {
          question: 'Do you provide technical support for products?',
          answer: 'We provide basic technical support to help you download and access your purchased products. For product-specific technical questions, we offer limited support as outlined in each product description.'
        },
        {
          question: 'Do you offer product updates?',
          answer: 'Yes, for products that receive updates, you will have access to the latest versions at no additional cost. You may be notified by email when significant updates are available.'
        },
        {
          question: 'What are the system requirements for your products?',
          answer: 'System requirements vary by product. Please check the individual product descriptions for specific requirements before making a purchase.'
        }
      ]
    },
    {
      title: 'Special Offers',
      faqs: [
        {
          question: 'Do you have any current promotions?',
          answer: 'We regularly offer special promotions on our VAI services. Check our products page or subscribe to our newsletter to stay updated on current deals and limited-time offers for VAI Coaching, Masterclass, Toolkit, and Web Gen services.'
        },
        {
          question: 'What does VAI Coaching include?',
          answer: 'VAI Coaching includes personalized one-on-one sessions with our AI experts, tailored strategies for your specific business needs, implementation guidance, and ongoing support. Each session is designed to help you leverage AI technology effectively for business growth and adaptation.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products, purchasing process, and policies.
            Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="text-primary-600 hover:text-primary-500 font-medium">Contact our support team</Link>.
          </p>
        </div>

        <div className="space-y-10">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary-600 text-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg text-primary-100 mb-6 max-w-3xl mx-auto">
            Our support team is ready to help you with any questions or concerns you might have about our products or services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact" 
              className="btn-white"
            >
              Contact Us
            </Link>
            <a 
              href="mailto:chris.t@ventarosales.com" 
              className="btn-outline-white"
            >
              Email Support
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Base</h3>
            <p className="text-gray-600 mb-4">
              Browse our detailed guides and tutorials to get the most out of our products.
            </p>
            <Link href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              View Knowledge Base
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Special Offers</h3>
            <p className="text-gray-600 mb-4">
              Check out our current promotions and limited-time deals on our high-quality digital products.
            </p>
            <Link href="/products" className="text-primary-600 hover:text-primary-500 font-medium">
              View Current Deals
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Delivery</h3>
            <p className="text-gray-600 mb-4">
              Instant access to all products with secure digital delivery - no shipping required.
            </p>
            <span className="text-primary-600 font-medium">
              100% Digital Business
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}