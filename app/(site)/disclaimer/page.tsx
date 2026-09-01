import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Clause, LegalList, LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${siteConfig.name}. All content is provided for general information only and is not financial, investment, tax, or legal advice.`,
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro={
        <>
          <p>
            Everything on {siteConfig.name} is published for general information
            and education only. It is <strong>not</strong> financial,
            investment, tax, accounting, or legal advice, and no part of it is a
            recommendation to buy, sell, or hold anything.
          </p>
          <p>
            We are not your adviser, broker, or fiduciary, and using this site
            creates no professional relationship. Before acting on anything you
            read here, speak to a licensed professional who knows your
            circumstances.
          </p>
        </>
      }
    >
      <Clause heading="1. Information only">
        <p>
          The content on {siteConfig.name} ({siteConfig.url}) — including
          articles, calculators and their results, market and price data, bank
          routing numbers, tables, charts, and any other material (together, the
          &ldquo;Content&rdquo;) — is provided for general informational and
          educational purposes only.
        </p>
        <p>
          The Content is general in nature. It does not take account of your
          objectives, financial situation, tax position, or needs, and it is not
          tailored to you. You are solely responsible for evaluating whether any
          information is appropriate for your circumstances.
        </p>
      </Clause>

      <Clause heading="2. Not financial, investment, tax, or legal advice">
        <p>
          Nothing on this site constitutes financial advice, investment advice,
          securities advice, trading advice, tax advice, accounting advice, or
          legal advice. {siteConfig.name} is not a registered investment
          adviser, broker-dealer, investment bank, bank, credit union, lender,
          mortgage broker, insurance producer, tax preparer, accountant, or law
          firm, and it is not licensed or registered with any financial or
          securities regulator in any jurisdiction.
        </p>
        <p>
          No Content should be relied upon as the basis for any financial
          decision. Always obtain independent advice from a suitably licensed
          professional before making any decision about borrowing, saving,
          investing, insurance, retirement, or tax.
        </p>
      </Clause>

      <Clause heading="3. No adviser, fiduciary, or professional relationship">
        <p>
          Your use of this site does not create any adviser–client,
          fiduciary, agency, broker, banker, accountant, or attorney–client
          relationship between you and {siteConfig.name} or anyone associated
          with it. We owe you no duty of care in respect of any decision you
          make, and we do not monitor, supervise, or manage anyone&rsquo;s
          finances.
        </p>
      </Clause>

      <Clause heading="4. No offer or solicitation">
        <p>
          Nothing on this site is an offer, solicitation, inducement, or
          recommendation to buy, sell, subscribe for, or deal in any security,
          digital asset, deposit product, loan, insurance product, or other
          financial instrument, nor to engage the services of any institution.
          No Content is directed at any person in any jurisdiction where such an
          offer or solicitation would be unlawful.
        </p>
      </Clause>

      <Clause heading="5. Calculators produce estimates, not quotes">
        <p>
          Our calculators apply standard formulas to the figures you enter. They
          are illustrative models, not quotations, pre-approvals, offers of
          credit, or projections of guaranteed outcomes. Results may differ —
          sometimes materially — from any figure an institution actually gives
          you.
        </p>
        <p>Among other things, our calculators generally do not account for:</p>
        <LegalList
          items={[
            'Origination, application, valuation, legal, closing, servicing, or early-repayment fees.',
            'Taxes of any kind, including income, capital gains, stamp duty, or property tax, and any reliefs or allowances.',
            'Insurance premiums, mortgage insurance, escrow or impound amounts, service charges, or maintenance costs.',
            'Variable, tracker, introductory, or promotional rates, and any future change in rates.',
            'Inflation, changes in your income or employment, market volatility, or investment losses.',
            'Compounding, day-count, rounding, or payment-timing conventions specific to a particular lender or provider.',
            'Eligibility, affordability, underwriting, or regulatory limits and contribution caps.',
          ]}
        />
        <p>
          Selecting a currency in a calculator changes only the unit of display.
          It does <strong>not</strong> convert amounts and applies no exchange
          rate. Enter your figures in the currency you have selected.
        </p>
      </Clause>

      <Clause heading="6. Bank, routing number, and address information">
        <p>
          Routing numbers, institution details, and addresses are compiled from
          publicly available sources, including regulator records and
          institutions&rsquo; own published material, and are believed accurate
          as at the date stated on the relevant page. This information changes,
          and mergers, rebrands, and relocations occur frequently.
        </p>
        <p>
          A registered or corporate address is <strong>not</strong> a payment
          address. Institutions publish separate instructions for incoming
          transfers, and the correct routing number depends on the transfer type
          and on where your account was opened. Always confirm the routing
          number and any address directly with your institution before
          initiating a transfer. We accept no responsibility for
          misdirected, delayed, rejected, or lost payments.
        </p>
      </Clause>

      <Clause heading="7. Market and price data">
        <p>
          Market, index, commodity, rate, and cryptocurrency data is obtained
          from third-party sources. It may be delayed, interrupted, incomplete,
          or inaccurate, and is not a real-time or official quotation. Where a
          page shows illustrative or placeholder figures, that is stated on the
          page. Data must not be used for trading, valuation, settlement,
          accounting, or any other operational purpose.
        </p>
        <p>
          Past performance is not a reliable indicator of future results. The
          value of investments and digital assets can fall as well as rise, and
          you may get back less than you invested.
        </p>
      </Clause>

      <Clause heading="8. Cryptocurrency and digital asset risk">
        <p>
          Digital assets are speculative and highly volatile. They may be
          unregulated or inconsistently regulated in your jurisdiction, are
          generally <strong>not</strong> protected by deposit insurance or
          investor compensation schemes, and can lose all of their value.
          Holdings may be lost permanently through error, key loss, fraud,
          protocol failure, or platform insolvency. Coverage of any asset,
          protocol, platform, or project on this site is never an endorsement or
          an indication of quality, safety, or legality.
        </p>
      </Clause>

      <Clause heading="9. Not a bank; no insured products">
        <p>
          {siteConfig.name} is not a bank, deposit-taker, lender, money
          transmitter, custodian, or payment provider. We do not hold or
          transmit client money or assets and we do not open, operate, or
          service accounts. Nothing on this site is insured by the FDIC, NCUA,
          SIPC, FSCS, or any equivalent scheme, and no reference to any
          institution implies that we are affiliated with it or that any product
          is insured.
        </p>
      </Clause>

      <Clause heading="10. Forward-looking statements">
        <p>
          Content may include forecasts, projections, targets, estimates, and
          other forward-looking statements. These are opinions or models based
          on assumptions that may prove incorrect, are subject to significant
          uncertainty, and are not guarantees. Actual outcomes may differ
          materially. We undertake no obligation to update any forward-looking
          statement.
        </p>
      </Clause>

      <Clause heading="11. Accuracy, errors, and omissions">
        <p>
          We compile the Content in good faith but make no representation or
          warranty, express or implied, as to its accuracy, adequacy, currency,
          completeness, reliability, suitability, or availability. The Content
          may contain typographical, computational, factual, or transmission
          errors and may become out of date. We may change or remove any Content
          at any time without notice, and we are under no obligation to update
          it.
        </p>
      </Clause>

      <Clause heading="12. Third-party content, links, and trademarks">
        <p>
          The site references third-party institutions, products, and services
          and links to external websites we do not control. We do not endorse,
          verify, or accept responsibility for any third-party content, product,
          service, privacy practice, or security practice, and following a link
          is at your own risk.
        </p>
        <p>
          All institution names, brand names, and trademarks referenced on this
          site remain the property of their respective owners and are used only
          to identify those institutions factually. Their use does not imply any
          affiliation with, sponsorship by, endorsement by, or partnership with
          those owners.
        </p>
      </Clause>

      <Clause heading="13. No warranties">
        <p>
          The site and the Content are provided &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; without warranty of any kind. To the
          fullest extent permitted by law we disclaim all warranties, express,
          implied, statutory, or otherwise, including any implied warranties of
          merchantability, fitness for a particular purpose, accuracy, quiet
          enjoyment, and non-infringement, and any warranty that the site will
          be uninterrupted, timely, secure, or error-free.
        </p>
      </Clause>

      <Clause heading="14. Limitation of liability">
        <p>
          To the fullest extent permitted by law, neither {siteConfig.name} nor
          its owners, officers, employees, contributors, contractors, or
          suppliers shall be liable for any loss or damage of any kind arising
          out of or in connection with your use of, or reliance on, the site or
          the Content. This includes, without limitation, direct, indirect,
          incidental, special, consequential, exemplary, or punitive damages,
          and any lost profits, lost savings, lost data, investment losses,
          trading losses, missed opportunities, misdirected payments, or
          business interruption, whether based in contract, tort (including
          negligence), strict liability, statute, or otherwise, and whether or
          not we were advised of the possibility of such loss.
        </p>
        <p>
          Nothing in this Disclaimer excludes or limits any liability that
          cannot lawfully be excluded or limited, including liability for fraud
          or fraudulent misrepresentation, or for death or personal injury
          caused by negligence. Some jurisdictions do not allow the exclusion of
          certain warranties or the limitation of certain damages, so some of
          the above may not apply to you; in that case our liability is limited
          to the minimum extent permitted by law.
        </p>
      </Clause>

      <Clause heading="15. Your responsibility">
        <p>
          You use this site at your own risk and you are solely responsible for
          any decision you make and for verifying any information before acting
          on it. You agree to indemnify and hold harmless {siteConfig.name} and
          its owners, officers, employees, and contributors from any claim,
          liability, loss, or expense (including reasonable legal fees) arising
          from your use of the site or your breach of these terms.
        </p>
      </Clause>

      <Clause heading="16. Advertising, affiliate, and sponsorship disclosure">
        <p>
          {siteConfig.name} may earn revenue from advertising, sponsorships, and
          affiliate arrangements, and may receive compensation when you click a
          link or apply for a product. This may affect which products are
          written about and where they appear. It does not affect the formulas
          used by our calculators or the factual data we publish, and it is
          never payment for a favourable review. Sponsored or affiliate content
          is identified where it appears. We do not sell editorial coverage.
        </p>
      </Clause>

      <Clause heading="17. Jurisdiction and local law">
        <p>
          The Content is prepared principally with a United States readership in
          mind. Financial products, tax treatment, regulation, terminology, and
          consumer protections differ by country and by state, and information
          that is correct in one jurisdiction may be wrong or unlawful to rely
          on in another. It is your responsibility to determine whether the
          Content is appropriate and lawful for use where you are, and to comply
          with all laws that apply to you.
        </p>
      </Clause>

      <Clause heading="18. Changes to this Disclaimer">
        <p>
          We may amend this Disclaimer at any time by posting an updated version
          on this page with a revised effective date. Your continued use of the
          site after a change takes effect constitutes acceptance of the
          amended Disclaimer.
        </p>
      </Clause>

      <Clause heading="19. Related documents">
        <p>
          This Disclaimer forms part of, and should be read together with, our{' '}
          <Link href="/terms-of-service" className="link-accent">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="link-accent">
            Privacy Policy
          </Link>
          .
        </p>
      </Clause>

      <Clause heading="20. Contact">
        <p>
          Questions about this Disclaimer can be sent to{' '}
          <a href="mailto:legal@coinscribed.com" className="link-accent">
            legal@coinscribed.com
          </a>
          . If you believe any Content is inaccurate, please tell us and we will
          review it.
        </p>
      </Clause>
    </LegalPage>
  )
}
