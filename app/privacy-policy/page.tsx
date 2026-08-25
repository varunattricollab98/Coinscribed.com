import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-brand-light-gray-text dark:text-zinc-500">
          Effective Date: January 1, 2024
        </p>

        <div className="mt-8 space-y-8 text-brand-dark-gray dark:text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3 leading-relaxed">
              {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website{' '}
              <a href={siteConfig.url} className="text-brand-zinc underline">
                {siteConfig.url}
              </a>
              . This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">
              We may collect information about you in a variety of ways. The information we may
              collect on the Site includes:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Usage Data:</strong> Information about your device, browser, IP address,
                pages visited, time spent on pages, and other diagnostic data collected
                automatically.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies and similar tracking
                technologies to track activity on our Site and hold certain information.
              </li>
              <li>
                <strong>Analytics:</strong> We may use third-party analytics services (such as
                Google Analytics) to evaluate use of the Site.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="mt-3 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
            <p className="mt-3 leading-relaxed">
              We may employ third-party companies and individuals to facilitate our Service,
              provide the Service on our behalf, perform Service-related services, or assist us
              in analyzing how our Service is used. These third parties have access to your
              information only to perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Advertising</h2>
            <p className="mt-3 leading-relaxed">
              We may use third-party advertising companies to serve ads when you visit our
              website. These companies may use information about your visits to this and other
              websites to provide advertisements about goods and services of interest to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data Security</h2>
            <p className="mt-3 leading-relaxed">
              The security of your personal information is important to us, but remember that no
              method of transmission over the Internet or method of electronic storage is 100%
              secure. While we strive to use commercially acceptable means to protect your
              personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Children&apos;s Privacy</h2>
            <p className="mt-3 leading-relaxed">
              Our Service does not address anyone under the age of 13. We do not knowingly
              collect personally identifiable information from anyone under the age of 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
            <p className="mt-3 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the effective
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@coinscribed.com" className="text-brand-zinc underline">
                privacy@coinscribed.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
