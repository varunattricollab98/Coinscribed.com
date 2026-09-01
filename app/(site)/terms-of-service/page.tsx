import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Clause, LegalList, LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  alternates: { canonical: '/terms-of-service' },
  title: 'Terms of Service',
  description: `Terms of Service for ${siteConfig.name}. The conditions on which you may use this website and its calculators, data, and content.`,
}

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <>
          <p>
            By using {siteConfig.name} you agree to these terms. The site is an
            information resource: it gives you no advice, makes you no promises
            about accuracy, and accepts no liability for decisions you make.
          </p>
          <p>
            Use it lawfully, do not scrape or attack it, and verify anything
            important with the relevant institution or a licensed professional
            before you act on it.
          </p>
        </>
      }
    >
      <Clause n={1} heading="Acceptance">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement
          between you and {siteConfig.name} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) governing your access to and use of{' '}
          {siteConfig.url} and everything on it (the &ldquo;Site&rdquo;). By
          accessing or using the Site you confirm that you accept these Terms
          and that you agree to comply with them. If you do not agree, do not
          use the Site.
        </p>
      </Clause>

      <Clause n={2} heading="Eligibility">
        <p>
          You must be at least 18 years old, or the age of majority where you
          live, and legally capable of entering into a binding contract. You must
          not use the Site if doing so is unlawful where you are, or if you are
          barred from doing so under any applicable sanctions or trade control
          law.
        </p>
      </Clause>

      <Clause n={3} heading="What the Site is — and is not">
        <p>
          The Site publishes news, educational articles, financial calculators,
          reference data such as bank routing numbers, and market information,
          all for general information and education.
        </p>
        <p>
          The Site is <strong>not</strong> a financial adviser, broker-dealer,
          bank, lender, credit union, money transmitter, custodian, payment
          service, insurer, tax adviser, accountant, or law firm, and we are not
          licensed or registered as any of those in any jurisdiction. We provide
          no financial, investment, tax, accounting, or legal advice; we make no
          recommendations; and we hold no client money or assets. Full detail is
          in our{' '}
          <Link href="/disclaimer" className="link-accent">
            Disclaimer
          </Link>
          , which forms part of these Terms.
        </p>
      </Clause>

      <Clause n={4} heading="Licence to use the Site">
        <p>
          We grant you a limited, personal, non-exclusive, non-transferable,
          revocable licence to access and use the Site and to view, download,
          and print Content for your own personal, non-commercial reference. All
          other rights are reserved.
        </p>
      </Clause>

      <Clause n={5} heading="Things you must not do">
        <p>You agree that you will not:</p>
        <LegalList
          items={[
            'Use the Site for any unlawful, fraudulent, deceptive, or harmful purpose, or in breach of any applicable law or regulation.',
            'Scrape, crawl, harvest, index, or systematically extract Content or data by automated means, or use the Site to build or train a dataset, database, or model, except by a compliant search-engine crawler obeying our robots directives.',
            'Republish, redistribute, sell, licence, sub-licence, rent, or otherwise commercially exploit Content without our prior written permission.',
            'Remove, obscure, or alter any copyright, trademark, attribution, or other proprietary notice.',
            'Frame, mirror, or present the Site or Content so as to misrepresent its source, or imply any endorsement, affiliation, or partnership that does not exist.',
            'Introduce any virus, worm, trojan, or other malicious code, or otherwise interfere with the Site, its infrastructure, or any other user.',
            'Attempt to gain unauthorised access to the Site, any account, any server, or any connected system, or probe, scan, or test the vulnerability of any of them.',
            'Impose an unreasonable or disproportionate load on our infrastructure, including by denial-of-service attack or excessive automated requests.',
            'Reverse engineer, decompile, or disassemble any part of the Site except to the extent that restriction is prohibited by law.',
            'Use the Site or Content to provide regulated financial advice or services to any third party, or to represent that we have endorsed or verified anything you do.',
          ]}
        />
      </Clause>

      <Clause n={6} heading="Calculators and tools">
        <p>
          The calculators are illustrative models. They return estimates based
          solely on the figures you enter, are not quotations, offers of credit,
          pre-approvals, or guarantees, and generally exclude fees, taxes,
          insurance, rate changes, inflation, and eligibility limits. Selecting a
          currency changes only the unit of display; it applies no exchange rate
          and converts nothing.
        </p>
        <p>
          Calculator inputs are processed in your browser. We do not require an
          account and we do not transmit or store the figures you type into a
          calculator on our servers.
        </p>
      </Clause>

      <Clause n={7} heading="Reference data and market data">
        <p>
          Routing numbers, institution details, addresses, and market data are
          compiled from public and third-party sources, may be delayed or out of
          date, and are provided without warranty. They must not be used for
          trading, settlement, valuation, accounting, or any operational purpose.
          Verify routing numbers and payment instructions directly with your
          institution before initiating any transfer. A corporate or registered
          address is not a payment address.
        </p>
      </Clause>

      <Clause n={8} heading="Intellectual property">
        <p>
          The Site, its design, code, text, calculators, compilations, and
          arrangement of data are owned by {siteConfig.name} or its licensors
          and are protected by copyright, database, trademark, and other
          intellectual property laws. Nothing in these Terms transfers any such
          right to you.
        </p>
      </Clause>

      <Clause n={9} heading="Third-party names and trademarks">
        <p>
          Institution names, brand names, logos, and trademarks referenced on the
          Site remain the property of their respective owners and are used
          nominatively — that is, only to identify those institutions and their
          products factually, as is necessary for a reference resource. Such use
          does not imply affiliation with, sponsorship by, endorsement by, or any
          commercial relationship with those owners. If you own a mark and
          object to its use here, contact us and we will review it promptly.
        </p>
      </Clause>

      <Clause n={10} heading="Third-party content, links, and services">
        <p>
          The Site links to and incorporates material from third parties,
          including news sources, market data providers, image providers, and
          institutions&rsquo; own websites. We do not control and are not
          responsible for third-party content, availability, accuracy, terms,
          privacy practices, or security. Your use of any third-party site or
          service is governed by that party&rsquo;s terms and is entirely at
          your own risk.
        </p>
      </Clause>

      <Clause n={11} heading="Newsletter and any material you send us">
        <p>
          Where the Site offers a newsletter or feedback route, you must supply
          only information you are entitled to provide, and you must not submit
          anything unlawful, infringing, defamatory, or confidential. By sending
          us feedback or suggestions you grant us a perpetual, worldwide,
          royalty-free licence to use them without obligation or compensation.
          We may decline, edit, or remove any submission.
        </p>
      </Clause>

      <Clause n={12} heading="Availability and changes">
        <p>
          The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. We do not guarantee uninterrupted or
          error-free availability and we may add, change, suspend, restrict, or
          discontinue any part of the Site, including any calculator, dataset, or
          feature, at any time and without notice or liability.
        </p>
      </Clause>

      <Clause n={13} heading="Disclaimer of warranties">
        <p>
          To the fullest extent permitted by law we disclaim all warranties,
          express, implied, statutory, or otherwise, including any implied
          warranty of merchantability, fitness for a particular purpose,
          accuracy, completeness, title, and non-infringement, and any warranty
          arising from course of dealing or usage of trade. We do not warrant
          that the Site will meet your requirements, that Content is accurate or
          current, or that the Site is free of harmful components.
        </p>
      </Clause>

      <Clause n={14} heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, neither {siteConfig.name} nor
          its owners, officers, employees, contributors, contractors, or
          suppliers will be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for any loss of
          profit, revenue, savings, data, goodwill, or opportunity, or for any
          investment loss, trading loss, misdirected or delayed payment, or
          business interruption, arising out of or in connection with the Site or
          the Content, whether in contract, tort (including negligence), strict
          liability, statute, or otherwise, and whether or not foreseeable.
        </p>
        <p>
          To the extent any liability cannot lawfully be excluded, our total
          aggregate liability arising out of or in connection with the Site is
          limited to one hundred United States dollars (USD 100).
        </p>
        <p>
          Nothing in these Terms excludes or limits liability that cannot
          lawfully be excluded or limited, including liability for fraud or
          fraudulent misrepresentation or for death or personal injury caused by
          negligence. Because some jurisdictions do not permit certain
          exclusions or limitations, parts of this clause may not apply to you.
        </p>
      </Clause>

      <Clause n={15} heading="Indemnity">
        <p>
          You agree to indemnify, defend, and hold harmless {siteConfig.name}{' '}
          and its owners, officers, employees, and contributors from and against
          any claim, demand, proceeding, loss, liability, damage, cost, or
          expense (including reasonable legal fees) arising out of or related to
          your use of the Site, your breach of these Terms, or your violation of
          any law or of any third party&rsquo;s rights.
        </p>
      </Clause>

      <Clause n={16} heading="Suspension and termination">
        <p>
          We may suspend or terminate your access to the Site at any time,
          without notice, if we reasonably believe you have breached these Terms
          or that your use poses a risk to the Site or to others. Clauses which
          by their nature should survive termination — including intellectual
          property, disclaimers, limitation of liability, indemnity, and
          governing law — survive.
        </p>
      </Clause>

      <Clause n={17} heading="Privacy">
        <p>
          Our handling of personal information is described in our{' '}
          <Link href="/privacy-policy" className="link-accent">
            Privacy Policy
          </Link>
          , which forms part of these Terms.
        </p>
      </Clause>

      <Clause n={18} heading="Changes to these Terms">
        <p>
          We may revise these Terms at any time by posting an updated version
          with a new effective date. Where a change is material we will take
          reasonable steps to highlight it. Your continued use of the Site after
          a change takes effect constitutes acceptance of the revised Terms. If
          you do not accept them, stop using the Site.
        </p>
      </Clause>

      <Clause n={19} heading="Governing law and disputes">
        <p>
          These Terms and any dispute arising out of or in connection with them
          or the Site are governed by the laws of the State of Delaware, United
          States, without regard to its conflict of laws rules, and you and we
          submit to the exclusive jurisdiction of the state and federal courts
          located in Delaware — except where mandatory law in your country of
          residence gives you the right to bring proceedings locally or to rely
          on the protection of your local consumer law, which is unaffected.
        </p>
        <p>
          Before commencing proceedings, please contact us so we can try to
          resolve the matter informally.
        </p>
      </Clause>

      <Clause n={20} heading="General">
        <p>
          If any provision of these Terms is held invalid or unenforceable, it
          will be limited or severed to the minimum extent necessary and the
          remainder will continue in force. Our failure to enforce any provision
          is not a waiver of it. You may not assign these Terms; we may assign
          them in connection with a merger, acquisition, or sale of assets.
          These Terms, together with the Disclaimer and Privacy Policy,
          constitute the entire agreement between you and us regarding the Site.
        </p>
      </Clause>

      <Clause n={21} heading="Contact">
        <p>
          Questions about these Terms:{' '}
          <a href="mailto:legal@coinscribed.com" className="link-accent">
            legal@coinscribed.com
          </a>
          .
        </p>
      </Clause>
    </LegalPage>
  )
}
