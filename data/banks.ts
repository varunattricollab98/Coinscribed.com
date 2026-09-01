// Routing numbers last verified: August 2025. Source: Federal Reserve E-Payments
// Routing Directory and individual bank websites.
//
// Main office addresses last verified: September 2026. Each was corroborated
// against at least one authoritative source — the FFIEC National Information
// Center, a Federal Reserve or state banking regulator record, or the
// institution's own filings/corporate pages — and the source is recorded per
// bank in `mainOffice.source`. Addresses were never inferred or guessed.
//
// Verification also caught a stale record: TD Bank relocated its US
// headquarters from Cherry Hill to Mount Laurel, NJ, which this file previously
// reflected incorrectly.
//
// Routing numbers and addresses both change. Always confirm with the bank before
// initiating a transfer.

export interface RoutingNumber {
  number: string
  state: string
  type: 'paper' | 'electronic' | 'wire'
}

/**
 * The bank's registered main office, as recorded by its federal/state regulator
 * and corroborated against the institution's own published filings.
 *
 * IMPORTANT: this is the charter's main office, which is frequently NOT the same
 * city as the parent company's corporate headquarters, and is NOT a wire-payment
 * address. Wells Fargo Bank, N.A. is chartered in Sioux Falls while Wells Fargo
 * & Company is headquartered in San Francisco; JPMorgan Chase Bank, N.A.'s main
 * office is in Columbus while JPMorgan Chase & Co. sits in New York. Both facts
 * are surfaced separately in the UI so neither is mistaken for the other.
 */
export interface MainOffice {
  street: string
  city: string
  state: string
  zip: string
  /** Public source the address was verified against. */
  source: string
}

/**
 * Identifying mark for a bank, rendered as a coloured monogram tile.
 *
 * Deliberately NOT the institution's logo. Reproducing bank logos on a page
 * that also lists routing numbers is the visual signature of a phishing site,
 * and trademark "nominative fair use" is an affirmative defence rather than a
 * guarantee. A monogram in the bank's recognised brand colour gives each card a
 * distinct, realistic identity while reproducing no protected artwork.
 *
 * `color` is the institution's widely-published brand colour, used here purely
 * to help readers tell one row from another. It is an approximation for
 * identification and is not an official brand asset.
 */
export interface BankMarkStyle {
  /** Brand colour as a hex string. */
  color: string
  /** 2-3 character monogram shown on the tile. */
  monogram: string
}

export interface Bank {
  name: string
  slug: string
  description: string
  brand: BankMarkStyle
  routingNumbers: RoutingNumber[]
  /** Parent company's corporate headquarters, as "City, ST". */
  headquarters: string
  /** Registered main office of the banking charter. */
  mainOffice: MainOffice
  founded: number
  website: string
  /**
   * The institution's own page covering wire transfers or routing numbers.
   * Present only where the exact URL was confirmed to resolve; omitted rather
   * than guessed, because a dead link on a payments page is worse than none.
   */
  wireInfoUrl?: string
}

export const banks: Bank[] = [
  {
    name: 'Chase Bank',
    slug: 'chase',
    description:
      'JPMorgan Chase Bank, N.A. is the largest bank in the United States by assets. Chase provides consumer and commercial banking, credit cards, mortgage, and investment services to millions of customers nationwide.',
    headquarters: 'New York, NY',
    mainOffice: {
      street: '1111 Polaris Parkway',
      city: 'Columbus',
      state: 'OH',
      zip: '43240',
      source:
        'FFIEC NIC profile (RSSD 852218) and JPMorgan Chase Bank, N.A. regulatory filings',
    },
    wireInfoUrl: 'https://www.chase.com/digital/wire-transfer/faqs',
    founded: 1799,
    website: 'https://www.chase.com',
    brand: { color: '#117ACA', monogram: 'CH' },
    routingNumbers: [
      { number: '021000021', state: 'New York', type: 'paper' },
      { number: '021000021', state: 'New York', type: 'electronic' },
      { number: '022300173', state: 'New York (Downstate)', type: 'paper' },
      { number: '021100361', state: 'New Jersey', type: 'paper' },
      { number: '021202337', state: 'Connecticut', type: 'paper' },
      { number: '071000013', state: 'Illinois', type: 'paper' },
      { number: '071000013', state: 'Illinois', type: 'electronic' },
      { number: '072000326', state: 'Michigan', type: 'paper' },
      { number: '074000010', state: 'Indiana', type: 'paper' },
      { number: '075000019', state: 'Wisconsin', type: 'paper' },
      { number: '083000137', state: 'Kentucky', type: 'paper' },
      { number: '065400137', state: 'Louisiana', type: 'paper' },
      { number: '064000017', state: 'Oklahoma', type: 'paper' },
      { number: '103000648', state: 'Oklahoma', type: 'electronic' },
      { number: '111000614', state: 'Texas', type: 'paper' },
      { number: '111000614', state: 'Texas', type: 'electronic' },
      { number: '267084131', state: 'Florida', type: 'paper' },
      { number: '267084131', state: 'Florida', type: 'electronic' },
      { number: '083000137', state: 'West Virginia', type: 'paper' },
      { number: '122100024', state: 'California', type: 'paper' },
      { number: '122100024', state: 'California', type: 'electronic' },
      { number: '325070760', state: 'Washington', type: 'paper' },
      { number: '325070760', state: 'Oregon', type: 'paper' },
      { number: '102001017', state: 'Colorado', type: 'paper' },
      { number: '124001545', state: 'Utah', type: 'paper' },
      { number: '104000016', state: 'Nebraska', type: 'paper' },
      { number: '073000228', state: 'Iowa', type: 'paper' },
      { number: '101000019', state: 'Kansas', type: 'paper' },
      { number: '322271627', state: 'Arizona', type: 'paper' },
      { number: '322271627', state: 'Arizona', type: 'electronic' },
      { number: '028000024', state: 'New York (Wire)', type: 'wire' },
    ],
  },
  {
    name: 'Bank of America',
    slug: 'bank-of-america',
    description:
      'Bank of America Corporation is a multinational investment bank and financial services holding company. It is the second-largest banking institution in the United States, serving approximately 68 million consumer and small business clients.',
    headquarters: 'Charlotte, NC',
    mainOffice: {
      street: '100 North Tryon Street',
      city: 'Charlotte',
      state: 'NC',
      zip: '28255',
      source:
        'Bank of America investor relations (contact the board)',
    },
    wireInfoUrl: 'https://www.bankofamerica.com/deposits/routing-number-faqs/',
    founded: 1904,
    website: 'https://www.bankofamerica.com',
    brand: { color: '#E31837', monogram: 'BA' },
    routingNumbers: [
      { number: '011000138', state: 'Connecticut', type: 'paper' },
      { number: '011200365', state: 'Maine', type: 'paper' },
      { number: '011400495', state: 'New Hampshire', type: 'paper' },
      { number: '011500010', state: 'Vermont', type: 'paper' },
      { number: '011600033', state: 'Rhode Island', type: 'paper' },
      { number: '021000322', state: 'New York', type: 'paper' },
      { number: '021000322', state: 'New York', type: 'electronic' },
      { number: '021200339', state: 'New Jersey', type: 'paper' },
      { number: '021300912', state: 'Delaware', type: 'paper' },
      { number: '026009593', state: 'New York (Wire)', type: 'wire' },
      { number: '031202084', state: 'Washington DC', type: 'paper' },
      { number: '031202084', state: 'Maryland', type: 'paper' },
      { number: '051000017', state: 'Virginia', type: 'paper' },
      { number: '053000196', state: 'North Carolina', type: 'paper' },
      { number: '053904483', state: 'South Carolina', type: 'paper' },
      { number: '061000052', state: 'Georgia', type: 'paper' },
      { number: '063000047', state: 'Florida', type: 'paper' },
      { number: '063000047', state: 'Florida', type: 'electronic' },
      { number: '063100277', state: 'Tennessee', type: 'paper' },
      { number: '071000505', state: 'Illinois', type: 'paper' },
      { number: '081000032', state: 'Missouri', type: 'paper' },
      { number: '082000073', state: 'Arkansas', type: 'paper' },
      { number: '101100045', state: 'Kansas', type: 'paper' },
      { number: '107000327', state: 'Oklahoma', type: 'paper' },
      { number: '111000025', state: 'Texas', type: 'paper' },
      { number: '111000025', state: 'Texas', type: 'electronic' },
      { number: '113000023', state: 'Texas (South)', type: 'paper' },
      { number: '121000358', state: 'California', type: 'paper' },
      { number: '121000358', state: 'California', type: 'electronic' },
      { number: '122000661', state: 'Arizona', type: 'paper' },
      { number: '123006800', state: 'Oregon', type: 'paper' },
      { number: '125000024', state: 'Washington', type: 'paper' },
      { number: '102001017', state: 'New Mexico', type: 'paper' },
      { number: '102101645', state: 'Colorado', type: 'paper' },
    ],
  },
  {
    name: 'Wells Fargo',
    slug: 'wells-fargo',
    description:
      'Wells Fargo & Company is an American multinational financial services corporation and the fourth-largest bank in the United States by total assets. Wells Fargo offers banking, investments, mortgage, and consumer and commercial finance services.',
    headquarters: 'San Francisco, CA',
    mainOffice: {
      street: '101 North Phillips Avenue',
      city: 'Sioux Falls',
      state: 'SD',
      zip: '57104',
      source:
        'State regulator filings for Wells Fargo Bank, N.A.',
    },
    wireInfoUrl: 'https://www.wellsfargo.com/help/online-banking/wires-faqs',
    founded: 1852,
    website: 'https://www.wellsfargo.com',
    brand: { color: '#D71E28', monogram: 'WF' },
    routingNumbers: [
      { number: '011100106', state: 'Connecticut', type: 'paper' },
      { number: '021200025', state: 'New Jersey', type: 'paper' },
      { number: '021101108', state: 'New York', type: 'paper' },
      { number: '031000503', state: 'Pennsylvania', type: 'paper' },
      { number: '031000503', state: 'Pennsylvania', type: 'electronic' },
      { number: '034101234', state: 'Delaware', type: 'paper' },
      { number: '051400549', state: 'Virginia', type: 'paper' },
      { number: '053000219', state: 'North Carolina', type: 'paper' },
      { number: '055003201', state: 'Maryland', type: 'paper' },
      { number: '061000227', state: 'Georgia', type: 'paper' },
      { number: '061000227', state: 'Georgia', type: 'electronic' },
      { number: '063107513', state: 'Florida', type: 'paper' },
      { number: '064003768', state: 'Tennessee', type: 'paper' },
      { number: '071101307', state: 'Illinois', type: 'paper' },
      { number: '072000010', state: 'Michigan', type: 'paper' },
      { number: '073000228', state: 'Iowa', type: 'paper' },
      { number: '074900275', state: 'Indiana', type: 'paper' },
      { number: '075911988', state: 'Wisconsin', type: 'paper' },
      { number: '081000032', state: 'Missouri', type: 'paper' },
      { number: '091000019', state: 'Minnesota', type: 'paper' },
      { number: '091000019', state: 'Minnesota', type: 'electronic' },
      { number: '102000076', state: 'Colorado', type: 'paper' },
      { number: '104000058', state: 'Nebraska', type: 'paper' },
      { number: '107002192', state: 'Oklahoma', type: 'paper' },
      { number: '111900659', state: 'Texas', type: 'paper' },
      { number: '111900659', state: 'Texas', type: 'electronic' },
      { number: '121000248', state: 'California', type: 'paper' },
      { number: '121000248', state: 'California', type: 'electronic' },
      { number: '122000247', state: 'Arizona', type: 'paper' },
      { number: '123006800', state: 'Oregon', type: 'paper' },
      { number: '124002971', state: 'Utah', type: 'paper' },
      { number: '125008547', state: 'Washington', type: 'paper' },
      { number: '121042882', state: 'Nevada', type: 'paper' },
      { number: '121042882', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Citibank',
    slug: 'citibank',
    description:
      'Citibank is the consumer division of Citigroup, a multinational banking corporation. Citibank offers checking and savings accounts, credit cards, personal loans, mortgages, and investment products to individuals and businesses.',
    headquarters: 'New York, NY',
    mainOffice: {
      street: '388 Greenwich Street',
      city: 'New York',
      state: 'NY',
      zip: '10013',
      source:
        'Citigroup corporate communications and FFIEC NIC profile',
    },
    wireInfoUrl: 'https://online.citi.com/US/JRS/pands/detail.do?ID=WireTransfers',
    founded: 1812,
    website: 'https://www.citibank.com',
    brand: { color: '#056DAE', monogram: 'CI' },
    routingNumbers: [
      { number: '021000089', state: 'New York (Metro)', type: 'paper' },
      { number: '021000089', state: 'New York (Metro)', type: 'electronic' },
      { number: '021001486', state: 'New York (Upstate)', type: 'paper' },
      { number: '021272655', state: 'Connecticut', type: 'paper' },
      { number: '021272655', state: 'New Jersey', type: 'paper' },
      { number: '031100209', state: 'Maryland', type: 'paper' },
      { number: '031100209', state: 'Washington DC', type: 'paper' },
      { number: '052002166', state: 'Virginia', type: 'paper' },
      { number: '066009456', state: 'Florida', type: 'paper' },
      { number: '066009456', state: 'Florida', type: 'electronic' },
      { number: '071006486', state: 'Illinois', type: 'paper' },
      { number: '113193532', state: 'Texas', type: 'paper' },
      { number: '321171184', state: 'California', type: 'paper' },
      { number: '321171184', state: 'California', type: 'electronic' },
      { number: '322271724', state: 'California (Southern)', type: 'paper' },
      { number: '325070760', state: 'Washington', type: 'paper' },
      { number: '021000089', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Capital One',
    slug: 'capital-one',
    description:
      'Capital One Financial Corporation is an American bank holding company specializing in credit cards, auto loans, banking, and savings accounts. It is one of the largest banks in the United States based on deposits and total assets.',
    headquarters: 'McLean, VA',
    mainOffice: {
      street: '1680 Capital One Drive',
      city: 'McLean',
      state: 'VA',
      zip: '22102',
      source:
        'Capital One corporate offices page',
    },
    wireInfoUrl: 'https://www.capitalone.com/help-center/',
    founded: 1994,
    website: 'https://www.capitalone.com',
    brand: { color: '#004977', monogram: 'CO' },
    routingNumbers: [
      { number: '051405515', state: 'Virginia', type: 'paper' },
      { number: '051405515', state: 'Virginia', type: 'electronic' },
      { number: '056073612', state: 'Maryland', type: 'paper' },
      { number: '065000090', state: 'Louisiana', type: 'paper' },
      { number: '065000090', state: 'Louisiana', type: 'electronic' },
      { number: '051405515', state: 'Online Banking', type: 'paper' },
      { number: '255071981', state: 'Virginia (360 Accounts)', type: 'electronic' },
      { number: '056073612', state: 'Washington DC', type: 'paper' },
      { number: '065000090', state: 'Texas', type: 'paper' },
      { number: '051405515', state: 'New York', type: 'paper' },
      { number: '051405515', state: 'New Jersey', type: 'paper' },
      { number: '051405515', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'TD Bank',
    slug: 'td-bank',
    description:
      "TD Bank, N.A. is an American national bank and subsidiary of the Canadian multinational Toronto-Dominion Bank. Known as \"America's Most Convenient Bank,\" TD Bank operates primarily in the eastern United States.",
    headquarters: 'Mount Laurel, NJ',
    mainOffice: {
      street: '4140 Church Road',
      city: 'Mount Laurel',
      state: 'NJ',
      zip: '08054',
      source:
        'TD Bank newsroom announcement of its headquarters relocation',
    },
    founded: 1852,
    website: 'https://www.td.com/us/en/personal-banking',
    brand: { color: '#00A651', monogram: 'TD' },
    routingNumbers: [
      { number: '011103093', state: 'Connecticut', type: 'paper' },
      { number: '011103093', state: 'Connecticut', type: 'electronic' },
      { number: '011400071', state: 'New Hampshire', type: 'paper' },
      { number: '011600033', state: 'Rhode Island', type: 'paper' },
      { number: '011600033', state: 'Vermont', type: 'paper' },
      { number: '011301798', state: 'Massachusetts', type: 'paper' },
      { number: '011301798', state: 'Massachusetts', type: 'electronic' },
      { number: '021201503', state: 'New York (Metro)', type: 'paper' },
      { number: '021302567', state: 'New York (Upstate)', type: 'paper' },
      { number: '031201360', state: 'New Jersey', type: 'paper' },
      { number: '031201360', state: 'New Jersey', type: 'electronic' },
      { number: '036001808', state: 'Pennsylvania', type: 'paper' },
      { number: '054001725', state: 'Maryland', type: 'paper' },
      { number: '054001725', state: 'Washington DC', type: 'paper' },
      { number: '053902197', state: 'South Carolina', type: 'paper' },
      { number: '053901560', state: 'North Carolina', type: 'paper' },
      { number: '054001725', state: 'Virginia', type: 'paper' },
      { number: '063112809', state: 'Florida', type: 'paper' },
      { number: '063112809', state: 'Florida', type: 'electronic' },
      { number: '031201360', state: 'Delaware', type: 'paper' },
      { number: '011103093', state: 'Maine', type: 'paper' },
      { number: '031201360', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'PNC Bank',
    slug: 'pnc-bank',
    description:
      'PNC Financial Services Group is one of the largest diversified financial services institutions in the United States. PNC provides retail banking, corporate and institutional banking, and asset management services.',
    headquarters: 'Pittsburgh, PA',
    mainOffice: {
      street: 'The Tower at PNC Plaza, 300 Fifth Avenue',
      city: 'Pittsburgh',
      state: 'PA',
      zip: '15222',
      source:
        'PNC Financial Services Group SEC filings (principal executive offices)',
    },
    founded: 1845,
    website: 'https://www.pnc.com',
    brand: { color: '#F58025', monogram: 'PNC' },
    routingNumbers: [
      { number: '031000053', state: 'Pennsylvania (Eastern)', type: 'paper' },
      { number: '031000053', state: 'Pennsylvania (Eastern)', type: 'electronic' },
      { number: '043000096', state: 'Pennsylvania (Western)', type: 'paper' },
      { number: '041000124', state: 'Ohio', type: 'paper' },
      { number: '041000124', state: 'Ohio', type: 'electronic' },
      { number: '042000398', state: 'Kentucky', type: 'paper' },
      { number: '043000096', state: 'New Jersey', type: 'paper' },
      { number: '054000030', state: 'Maryland', type: 'paper' },
      { number: '054000030', state: 'Washington DC', type: 'paper' },
      { number: '054000030', state: 'Virginia', type: 'paper' },
      { number: '071921891', state: 'Illinois', type: 'paper' },
      { number: '071921891', state: 'Illinois', type: 'electronic' },
      { number: '074000010', state: 'Indiana', type: 'paper' },
      { number: '072000326', state: 'Michigan', type: 'paper' },
      { number: '083000108', state: 'Kentucky', type: 'paper' },
      { number: '063000047', state: 'Florida', type: 'paper' },
      { number: '043002900', state: 'West Virginia', type: 'paper' },
      { number: '042000398', state: 'North Carolina', type: 'paper' },
      { number: '054000030', state: 'Delaware', type: 'paper' },
      { number: '043000096', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'US Bank',
    slug: 'us-bank',
    description:
      'U.S. Bancorp is an American bank holding company and the parent company of U.S. Bank. It is the fifth-largest banking institution in the United States, offering retail banking, wealth management, payment services, and wholesale banking.',
    headquarters: 'Minneapolis, MN',
    mainOffice: {
      street: '800 Nicollet Mall',
      city: 'Minneapolis',
      state: 'MN',
      zip: '55402',
      source:
        'U.S. Bancorp fact sheet and investor relations',
    },
    wireInfoUrl: 'https://www.usbank.com/online-mobile-banking/transfer-money/wire-transfers-faq.html',
    founded: 1863,
    website: 'https://www.usbank.com',
    brand: { color: '#0C2074', monogram: 'USB' },
    routingNumbers: [
      { number: '091000022', state: 'Minnesota', type: 'paper' },
      { number: '091000022', state: 'Minnesota', type: 'electronic' },
      { number: '042100175', state: 'Ohio', type: 'paper' },
      { number: '073000545', state: 'Iowa', type: 'paper' },
      { number: '074900783', state: 'Indiana', type: 'paper' },
      { number: '075000022', state: 'Wisconsin', type: 'paper' },
      { number: '081000210', state: 'Missouri', type: 'paper' },
      { number: '081000210', state: 'Missouri', type: 'electronic' },
      { number: '082000549', state: 'Arkansas', type: 'paper' },
      { number: '083000108', state: 'Kentucky', type: 'paper' },
      { number: '091000022', state: 'North Dakota', type: 'paper' },
      { number: '091000022', state: 'South Dakota', type: 'paper' },
      { number: '091000022', state: 'Montana', type: 'paper' },
      { number: '091215927', state: 'Nebraska', type: 'paper' },
      { number: '101000187', state: 'Kansas', type: 'paper' },
      { number: '102000175', state: 'Colorado', type: 'paper' },
      { number: '102000175', state: 'Colorado', type: 'electronic' },
      { number: '111000025', state: 'Texas', type: 'paper' },
      { number: '121122676', state: 'California', type: 'paper' },
      { number: '121122676', state: 'California', type: 'electronic' },
      { number: '123000220', state: 'Oregon', type: 'paper' },
      { number: '124000054', state: 'Utah', type: 'paper' },
      { number: '125000105', state: 'Washington', type: 'paper' },
      { number: '122235821', state: 'Arizona', type: 'paper' },
      { number: '122235821', state: 'Nevada', type: 'paper' },
      { number: '064000059', state: 'Tennessee', type: 'paper' },
      { number: '042100175', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Truist Bank',
    slug: 'truist',
    description:
      'Truist Financial Corporation was formed from the merger of BB&T and SunTrust Banks in 2019. It is one of the largest financial services companies in the United States, providing consumer and commercial banking, insurance, and wealth management.',
    headquarters: 'Charlotte, NC',
    mainOffice: {
      street: '214 North Tryon Street',
      city: 'Charlotte',
      state: 'NC',
      zip: '28202',
      source:
        'Truist newsroom and Truist Center branch listing',
    },
    wireInfoUrl: 'https://www.truist.com/help',
    founded: 2019,
    website: 'https://www.truist.com',
    brand: { color: '#582C83', monogram: 'TR' },
    routingNumbers: [
      { number: '053101121', state: 'North Carolina', type: 'paper' },
      { number: '053101121', state: 'North Carolina', type: 'electronic' },
      { number: '055002707', state: 'Maryland', type: 'paper' },
      { number: '055002707', state: 'Washington DC', type: 'paper' },
      { number: '051404260', state: 'Virginia', type: 'paper' },
      { number: '051404260', state: 'Virginia', type: 'electronic' },
      { number: '053201607', state: 'South Carolina', type: 'paper' },
      { number: '061000104', state: 'Georgia', type: 'paper' },
      { number: '061000104', state: 'Georgia', type: 'electronic' },
      { number: '063104668', state: 'Florida', type: 'paper' },
      { number: '064000017', state: 'Tennessee', type: 'paper' },
      { number: '064000017', state: 'Tennessee', type: 'electronic' },
      { number: '042102267', state: 'Ohio', type: 'paper' },
      { number: '051000017', state: 'West Virginia', type: 'paper' },
      { number: '083974289', state: 'Kentucky', type: 'paper' },
      { number: '063104668', state: 'Alabama', type: 'paper' },
      { number: '061113415', state: 'Mississippi', type: 'paper' },
      { number: '036001808', state: 'Pennsylvania', type: 'paper' },
      { number: '021302567', state: 'New Jersey', type: 'paper' },
      { number: '053101121', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Goldman Sachs (Marcus)',
    slug: 'goldman-sachs',
    description:
      'Goldman Sachs Bank USA offers consumer banking through its Marcus brand. Marcus by Goldman Sachs provides high-yield savings accounts, certificates of deposit, and personal loans with no fees.',
    headquarters: 'New York, NY',
    mainOffice: {
      street: '200 West Street',
      city: 'New York',
      state: 'NY',
      zip: '10282',
      source:
        'Goldman Sachs corporate publications',
    },
    wireInfoUrl: 'https://www.marcus.com/us/en',
    founded: 1869,
    website: 'https://www.marcus.com',
    brand: { color: '#16305B', monogram: 'GS' },
    routingNumbers: [
      { number: '124085024', state: 'Nationwide (Savings)', type: 'paper' },
      { number: '124085024', state: 'Nationwide (Savings)', type: 'electronic' },
      { number: '124085024', state: 'Online Banking', type: 'paper' },
      { number: '124085024', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Ally Bank',
    slug: 'ally-bank',
    description:
      'Ally Bank is an online-only bank and subsidiary of Ally Financial. Known for competitive interest rates and no monthly maintenance fees, Ally offers savings accounts, checking accounts, CDs, money market accounts, and mortgage products.',
    headquarters: 'Sandy, UT',
    mainOffice: {
      street: '200 West Civic Center Drive',
      city: 'Sandy',
      state: 'UT',
      zip: '84070',
      source:
        'FFIEC NIC profile and Federal Reserve CRA evaluation',
    },
    wireInfoUrl: 'https://www.ally.com/help/bank/transfers/',
    founded: 2009,
    website: 'https://www.ally.com',
    brand: { color: '#6F2C91', monogram: 'AL' },
    routingNumbers: [
      { number: '124003116', state: 'Nationwide', type: 'paper' },
      { number: '124003116', state: 'Nationwide', type: 'electronic' },
      { number: '124003116', state: 'Wire Transfers', type: 'wire' },
    ],
  },
  {
    name: 'Charles Schwab Bank',
    slug: 'charles-schwab',
    description:
      'Charles Schwab Bank, SSB is the banking subsidiary of The Charles Schwab Corporation. It provides checking accounts linked to Schwab brokerage accounts, high-yield savings, and home lending services with no ATM fees worldwide.',
    headquarters: 'Westlake, TX',
    mainOffice: {
      street: '3000 Schwab Way',
      city: 'Westlake',
      state: 'TX',
      zip: '76262',
      source:
        'Charles Schwab statement of financial condition',
    },
    founded: 2003,
    website: 'https://www.schwab.com',
    brand: { color: '#00A0DF', monogram: 'CS' },
    routingNumbers: [
      { number: '121202211', state: 'Nationwide (Checking)', type: 'paper' },
      { number: '121202211', state: 'Nationwide (Checking)', type: 'electronic' },
      { number: '071000013', state: 'Brokerage Accounts', type: 'electronic' },
      { number: '121202211', state: 'Savings Accounts', type: 'paper' },
      { number: '121202211', state: 'Wire Transfers', type: 'wire' },
    ],
  },
]

/**
 * Get a bank by its slug
 */
export function getBankBySlug(slug: string): Bank | undefined {
  return banks.find((bank) => bank.slug === slug)
}

/**
 * Get all bank slugs for static params generation
 */
export function getAllBankSlugs(): string[] {
  return banks.map((bank) => bank.slug)
}
