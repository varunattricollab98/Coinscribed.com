import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${siteConfig.name}. Read our terms and conditions for using the website.`,
}

export default function TermsOfServicePage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-ink-muted dark:text-ink-inverse-muted">
          Effective Date: January 1, 2024
        </p>

        <div className="mt-8 space-y-8 text-ink-body dark:text-ink-inverse-body">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-3 leading-relaxed">
              By accessing and using {siteConfig.name} ({siteConfig.url}), you accept and agree
              to be bound by these Terms of Service. If you do not agree to these terms, please
              do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Use of Service</h2>
            <p className="mt-3 leading-relaxed">
              {siteConfig.name} provides financial calculators, news aggregation, bank routing
              number information, and educational content for informational purposes only. You
              agree to use the Service only for lawful purposes and in accordance with these
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. No Financial Advice</h2>
            <p className="mt-3 leading-relaxed">
              The content on this website is for informational and educational purposes only and
              should not be construed as professional financial advice. We are not licensed
              financial advisors. Always consult with a qualified financial professional before
              making any financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Calculator Accuracy</h2>
            <p className="mt-3 leading-relaxed">
              While we strive to ensure our calculators provide accurate results, we make no
              guarantees regarding the accuracy, completeness, or reliability of any
              calculations. Results are estimates and should not be relied upon as the sole
              basis for financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Bank Routing Number Information</h2>
            <p className="mt-3 leading-relaxed">
              Routing number information is provided as a convenience and is sourced from
              publicly available data. We recommend verifying routing numbers directly with your
              financial institution before initiating any transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
            <p className="mt-3 leading-relaxed">
              The Service and its original content, features, and functionality are owned by{' '}
              {siteConfig.name} and are protected by international copyright, trademark, patent,
              trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Third-Party Links</h2>
            <p className="mt-3 leading-relaxed">
              Our Service may contain links to third-party websites or services that are not
              owned or controlled by {siteConfig.name}. We have no control over, and assume no
              responsibility for, the content, privacy policies, or practices of any third-party
              websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">
              In no event shall {siteConfig.name}, its directors, employees, partners, agents,
              suppliers, or affiliates be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from your access to or
              use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
            <p className="mt-3 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision
              is material, we will provide at least 30 days notice prior to any new terms taking
              effect. Your continued use of the Service after any such changes constitutes your
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@coinscribed.com" className="text-ink-body underline">
                legal@coinscribed.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
