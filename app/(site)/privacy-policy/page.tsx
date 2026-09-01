import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Clause, LegalList, LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}. What we collect, what we do not collect, who processes it, and the rights you have.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <>
          <p>
            You do not need an account to use {siteConfig.name}, and the figures
            you type into a calculator stay in your browser — we never receive
            or store them.
          </p>
          <p>
            We collect standard technical data needed to serve and secure the
            site, and we use a small amount of browser storage to remember your
            currency and theme. We do not sell personal information.
          </p>
        </>
      }
    >
      <Clause n={1} heading="Who we are and what this covers">
        <p>
          This Privacy Policy explains how {siteConfig.name} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) handles information when you visit{' '}
          {siteConfig.url}. It covers the public website only. It does not cover
          third-party sites we link to, each of which has its own policy.
        </p>
      </Clause>

      <Clause n={2} heading="What we do not collect">
        <p>
          So that this is unambiguous, we want to be specific about what does{' '}
          <strong>not</strong> happen on this site:
        </p>
        <LegalList
          items={[
            'There are no user accounts on the public site. We do not ask you to register, and we hold no usernames or passwords for readers.',
            'Calculator inputs are processed entirely in your browser. Loan amounts, balances, salaries, contribution rates, and every other figure you enter are never transmitted to us and never stored on our servers.',
            'We do not ask for and do not want your bank account number, card number, national identification number, or any credential. Never send those to us.',
            'We do not knowingly collect information from children (see the Children clause below).',
            'We do not sell personal information, and we do not share it for cross-context behavioural advertising.',
          ]}
        />
      </Clause>

      <Clause n={3} heading="What we do collect">
        <LegalList
          items={[
            <>
              <strong>Technical and usage data</strong>, collected automatically
              when you request a page: IP address, user-agent and device or
              browser characteristics, referring URL, the pages and files
              requested, timestamps, and error and performance diagnostics. This
              is inherent to serving a website and is used to deliver content,
              keep the site secure, and diagnose faults.
            </>,
            <>
              <strong>Browser storage.</strong> We use your
              browser&rsquo;s local storage to remember your preferences — your
              selected calculator currency and your light or dark theme. These
              stay on your device, are not personal identifiers, and are not sent
              to us. Clearing site data removes them.
            </>,
            <>
              <strong>Newsletter address, if and when that is connected.</strong>{' '}
              The newsletter form currently confirms your entry in the browser
              only and does <strong>not</strong> transmit or store your address
              anywhere. If we connect it to an email provider we will update this
              policy first and identify the provider.
            </>,
            <>
              <strong>Anything you choose to send us</strong>, such as the
              content of an email you write to us, which we keep only as long as
              needed to deal with it.
            </>,
          ]}
        />
      </Clause>

      <Clause n={4} heading="Cookies and similar technologies">
        <p>
          We aim to keep this minimal. Where cookies or equivalent technologies
          are used they fall into these categories: strictly necessary
          (delivering and securing the site), preference (remembering your
          currency and theme, which we implement in local storage rather than
          cookies), and — if and when enabled — analytics or advertising. Most
          browsers let you block or delete cookies and clear site storage;
          blocking strictly necessary items may stop parts of the site working.
        </p>
      </Clause>

      <Clause n={5} heading="Analytics and advertising">
        <p>
          We may use privacy-respecting analytics to understand aggregate usage,
          and we may in future display advertising. Where an analytics or
          advertising provider is used, it may set identifiers and process
          technical data as an independent controller under its own policy. We
          will name active providers in this policy. We do not combine analytics
          data with anything you type into a calculator, because we never receive
          that.
        </p>
      </Clause>

      <Clause n={6} heading="Third parties that process data when you use the site">
        <p>
          Serving this site necessarily involves other companies. The relevant
          ones, and what they see:
        </p>
        <LegalList
          items={[
            <>
              <strong>Vercel</strong> — hosting and content delivery. Processes
              your request data, including IP address, in order to serve pages.
            </>,
            <>
              <strong>Sanity</strong> — the content management system storing our
              articles. Serves article content and images.
            </>,
            <>
              <strong>CoinGecko</strong> — cryptocurrency prices. The price
              ticker and market hero request data{' '}
              <strong>directly from your browser</strong>, so CoinGecko receives
              your IP address and user-agent as a normal consequence of that
              request.
            </>,
            <>
              <strong>Yahoo Finance</strong> — index and commodity data. This is
              requested by <strong>our server</strong>, not your browser, so your
              IP address is not disclosed to them.
            </>,
            <>
              <strong>Unsplash and the Sanity image CDN</strong> — article
              imagery, loaded by your browser from those hosts.
            </>,
            <>
              <strong>Google Fonts (self-hosted)</strong> — our typefaces are
              served from our own domain, so no font request is made to Google.
            </>,
          ]}
        />
        <p>
          If you use the editorial studio at <code>/studio</code>, Sanity
          authenticates you as an editor under its own privacy terms; that area
          is not intended for readers.
        </p>
      </Clause>

      <Clause n={7} heading="Why we process data, and our legal bases">
        <p>
          We process technical data to deliver the site you requested, to keep it
          secure and prevent abuse, to diagnose and fix faults, and to
          understand aggregate usage so we can improve. Where the UK GDPR or EU
          GDPR applies, our legal bases are: <strong>legitimate interests</strong>{' '}
          (operating, securing, and improving the site);{' '}
          <strong>consent</strong> (any non-essential analytics or advertising,
          and any future newsletter subscription); and{' '}
          <strong>legal obligation</strong> (where we must retain or disclose
          something by law).
        </p>
      </Clause>

      <Clause n={8} heading="Retention">
        <p>
          Server and security logs are kept only as long as needed for
          diagnostics and abuse prevention, and are then deleted or aggregated.
          Preference values stay on your device until you clear site data.
          Correspondence is kept only as long as needed to handle the matter and
          to meet any legal requirement.
        </p>
      </Clause>

      <Clause n={9} heading="International transfers">
        <p>
          Our providers operate globally, so data may be processed in countries
          other than yours, including the United States. Where required, such
          transfers rely on an approved safeguard such as the European
          Commission&rsquo;s standard contractual clauses or an applicable
          adequacy decision.
        </p>
      </Clause>

      <Clause n={10} heading="Security">
        <p>
          The site is served over HTTPS and we apply reasonable technical and
          organisational measures. Not requiring accounts and not receiving your
          calculator figures is itself a deliberate safeguard: data we never
          collect cannot be breached. No method of transmission or storage is
          completely secure, however, and we cannot guarantee absolute security.
        </p>
      </Clause>

      <Clause n={11} heading="Your rights">
        <p>
          Depending on where you live you may have the right to access, correct,
          delete, restrict, or object to the processing of your personal
          information, to data portability, to withdraw consent, and not to be
          discriminated against for exercising these rights.
        </p>
        <p>
          If you are in California, the CCPA as amended by the CPRA gives you
          rights to know, delete, and correct, and to opt out of sale or of
          sharing for cross-context behavioural advertising — we do neither. If
          you are in the UK or EEA you may also lodge a complaint with your
          supervisory authority.
        </p>
        <p>
          To exercise a right, email{' '}
          <a href="mailto:privacy@coinscribed.com" className="link-accent">
            privacy@coinscribed.com
          </a>
          . Note that because we hold no account and no calculator data, there is
          often very little we hold about you; we may need enough information to
          locate any record before we can act.
        </p>
      </Clause>

      <Clause n={12} heading="Do Not Track and Global Privacy Control">
        <p>
          We do not track readers across other websites. Where a Global Privacy
          Control or similar opt-out signal is presented by your browser, we
          treat it as a valid opt-out of any non-essential analytics or
          advertising.
        </p>
      </Clause>

      <Clause n={13} heading="Children">
        <p>
          The site is intended for adults and is not directed at children. We do
          not knowingly collect personal information from anyone under 13 (or
          under 16 where local law sets that threshold). If you believe a child
          has provided us information, contact us and we will delete it.
        </p>
      </Clause>

      <Clause n={14} heading="Changes to this policy">
        <p>
          We may update this policy. The effective date at the top shows when it
          last changed, and we will take reasonable steps to highlight material
          changes. Continued use after a change takes effect constitutes
          acceptance.
        </p>
      </Clause>

      <Clause n={15} heading="Related documents and contact">
        <p>
          Read this together with our{' '}
          <Link href="/terms-of-service" className="link-accent">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/disclaimer" className="link-accent">
            Disclaimer
          </Link>
          . Privacy questions:{' '}
          <a href="mailto:privacy@coinscribed.com" className="link-accent">
            privacy@coinscribed.com
          </a>
          .
        </p>
      </Clause>
    </LegalPage>
  )
}
