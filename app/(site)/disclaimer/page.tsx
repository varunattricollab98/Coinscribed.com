import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${siteConfig.name}. Important information about the limitations of our content and tools.`,
}

export default function DisclaimerPage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Disclaimer</h1>
        <p className="mt-4 text-sm text-ink-muted dark:text-ink-inverse-muted">
          Effective Date: January 1, 2024
        </p>

        <div className="mt-8 space-y-8 text-ink-body dark:text-ink-inverse-body">
          <section>
            <h2 className="text-xl font-semibold">General Disclaimer</h2>
            <p className="mt-3 leading-relaxed">
              The information provided on {siteConfig.name} ({siteConfig.url}) is for general
              informational and educational purposes only. All information on the Site is
              provided in good faith, however, we make no representation or warranty of any
              kind, express or implied, regarding the accuracy, adequacy, validity, reliability,
              availability, or completeness of any information on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Not Financial Advice</h2>
            <p className="mt-3 leading-relaxed">
              The content on this website, including but not limited to calculator results, news
              articles, market data, and educational content, does not constitute financial,
              investment, tax, or legal advice. {siteConfig.name} is not a registered financial
              advisor, broker, or dealer.
            </p>
            <p className="mt-3 leading-relaxed">
              You should not make any financial decision based solely on the information
              provided on this website. Always seek the advice of a qualified financial
              professional with any questions you may have regarding your financial situation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Calculator Disclaimer</h2>
            <p className="mt-3 leading-relaxed">
              Our financial calculators are designed to provide general estimates only. Results
              may differ from actual outcomes due to variations in interest rates, fees, taxes,
              and other factors not accounted for in the calculations. Calculator results should
              be used as a starting point for your own research and planning.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Routing Number Information</h2>
            <p className="mt-3 leading-relaxed">
              Bank routing numbers displayed on this site are sourced from publicly available
              information. While we make every effort to keep this information current and
              accurate, routing numbers may change and we cannot guarantee their accuracy.
              Always verify routing numbers directly with your bank before initiating financial
              transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">News and Market Information</h2>
            <p className="mt-3 leading-relaxed">
              News articles and market information are provided for informational purposes and
              may not reflect the most current developments. We do not guarantee the timeliness
              or accuracy of any news content. Past performance of any market or investment does
              not guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">External Links Disclaimer</h2>
            <p className="mt-3 leading-relaxed">
              This website may contain links to external websites that are not provided or
              maintained by us. We do not guarantee the accuracy, relevance, timeliness, or
              completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Affiliate Disclaimer</h2>
            <p className="mt-3 leading-relaxed">
              {siteConfig.name} may earn commissions from affiliate partnerships and advertising.
              This may influence which products or services we write about and where they appear
              on the site, but it does not affect our editorial integrity or the accuracy of our
              calculators and tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-3 leading-relaxed">
              If you have questions about this disclaimer, contact us at{' '}
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
