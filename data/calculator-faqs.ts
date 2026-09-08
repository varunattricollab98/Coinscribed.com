import type { FAQItem } from '@/components/calculators/CalculatorFAQ'

/**
 * FAQ content per calculator.
 *
 * These answers are written to be accurate and genuinely useful, not to stuff
 * keywords — the calculators sit in a YMYL (money) context where a wrong answer
 * is worse than no answer. Each string is rendered visibly by CalculatorFAQ and
 * simultaneously fed to generateFAQSchema, so the FAQPage rich-result markup
 * always matches the on-page text.
 */
export const calculatorFAQs: Record<string, FAQItem[]> = {
  mortgage: [
    {
      question: 'What does this mortgage calculator include?',
      answer:
        'It estimates your principal-and-interest payment from the loan amount, interest rate, and term. Unless a field is provided for them, it does not include property taxes, homeowners insurance, HOA dues, or mortgage insurance, so your full monthly housing cost will usually be higher than the figure shown.',
    },
    {
      question: 'How much house can I afford?',
      answer:
        'A common guideline is to keep total housing costs at or below about 28% of your gross monthly income, and total debt payments below about 36%. Enter different prices and down payments here to see the monthly payment, then compare it against those limits and your own budget.',
    },
    {
      question: 'How does the down payment affect my payment?',
      answer:
        'A larger down payment reduces the amount you borrow, which lowers both the monthly payment and the total interest paid over the life of the loan. On a conventional loan, putting down 20% or more also typically removes the need for private mortgage insurance.',
    },
    {
      question: 'Why is the lender’s quote different from this estimate?',
      answer:
        'Lenders factor in fees, taxes, insurance, your credit profile, and the exact rate you qualify for, none of which a generic calculator can know. Treat this result as a planning estimate and rely on a lender’s Loan Estimate for real numbers.',
    },
    {
      question: 'What is an amortization schedule?',
      answer:
        'It is the month-by-month breakdown of how each payment splits between interest and principal. Early payments are mostly interest; over time more of each payment goes to principal, which is why paying extra early saves the most interest.',
    },
  ],

  '401k': [
    {
      question: 'How does an employer match work?',
      answer:
        'Many employers contribute to your 401(k) based on what you put in — for example, 50 cents per dollar up to 6% of your salary. That match is effectively free money, so contributing at least enough to capture the full match is usually the first priority.',
    },
    {
      question: 'How much should I contribute to my 401(k)?',
      answer:
        'At minimum, enough to get the full employer match. Beyond that, a frequently cited target is 15% of gross income including the match. The right number depends on your age, other savings, and retirement goals.',
    },
    {
      question: 'What return rate should I assume?',
      answer:
        'Long-run diversified stock-market returns have historically averaged roughly 6–7% a year after inflation, but any single year can be far higher or lower. Running the calculator with a conservative and an optimistic rate shows a realistic range rather than one guaranteed figure.',
    },
    {
      question: 'Are there annual contribution limits?',
      answer:
        'Yes. The IRS sets a limit each year, with an additional catch-up amount for people age 50 and older. Employer contributions are separate from your own limit. Check the current year’s figures on the IRS website before maximizing contributions.',
    },
  ],

  emi: [
    {
      question: 'What is an EMI?',
      answer:
        'EMI stands for Equated Monthly Installment — the fixed amount you repay each month on a loan. Every EMI contains both interest and principal, and the payment stays the same across the loan’s term on a standard fixed-rate loan.',
    },
    {
      question: 'How is EMI calculated?',
      answer:
        'The formula is EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the principal, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the number of monthly installments. This calculator applies that formula to the values you enter.',
    },
    {
      question: 'How can I reduce my EMI?',
      answer:
        'You can lower the EMI by borrowing less, securing a lower interest rate, or choosing a longer tenure. A longer tenure reduces the monthly amount but increases the total interest you pay, so it is a trade-off rather than a saving.',
    },
    {
      question: 'Does a longer loan tenure cost more overall?',
      answer:
        'Usually yes. A longer term spreads the principal over more months, lowering each payment, but you pay interest for longer, so the total interest — and total repayment — is higher than on a shorter term at the same rate.',
    },
  ],

  sip: [
    {
      question: 'What is a SIP?',
      answer:
        'A Systematic Investment Plan (SIP) is investing a fixed amount at regular intervals — typically monthly — rather than a single lump sum. It spreads your purchases across different prices over time, an approach known as rupee- or dollar-cost averaging.',
    },
    {
      question: 'How are SIP returns calculated?',
      answer:
        'Each contribution grows for the time it remains invested, compounding at the assumed rate of return. The calculator sums the future value of every installment to estimate the final corpus, then separates how much you invested from the estimated gains.',
    },
    {
      question: 'Are the returns guaranteed?',
      answer:
        'No. SIP returns depend on market performance and are not fixed. The rate you enter is an assumption for illustration only; actual returns will vary year to year and can be negative over short periods.',
    },
    {
      question: 'Is a SIP better than a lump-sum investment?',
      answer:
        'Neither is universally better. A SIP reduces the risk of investing everything at a market peak and suits regular income, while a lump sum can outperform when invested early in a rising market. Many investors use a mix based on their cash flow and risk comfort.',
    },
  ],

  'compound-interest': [
    {
      question: 'What is compound interest?',
      answer:
        'Compound interest is interest earned on both your original principal and on the interest already added to it. Because each period’s interest starts earning its own interest, savings grow faster over time than they would with simple interest.',
    },
    {
      question: 'How does compounding frequency affect growth?',
      answer:
        'The more often interest is compounded — daily versus monthly versus annually — the more you earn, because interest is added to the balance sooner and starts compounding earlier. The difference is modest at low rates and grows more noticeable at higher rates and over long periods.',
    },
    {
      question: 'What is the difference between simple and compound interest?',
      answer:
        'Simple interest is calculated only on the original principal, so it grows in a straight line. Compound interest is calculated on the principal plus accumulated interest, so the balance grows on a curve that steepens over time.',
    },
    {
      question: 'How long will it take my money to double?',
      answer:
        'A quick estimate is the Rule of 72: divide 72 by the annual interest rate to approximate the number of years to double. At 6% that is about 12 years. It is an approximation, so use this calculator for a precise figure.',
    },
  ],

  'loan-payoff': [
    {
      question: 'How do extra payments help pay off a loan faster?',
      answer:
        'Extra payments go straight to the principal, which shrinks the balance that interest is charged on. That reduces both the number of remaining payments and the total interest, so consistent extra payments can shorten the loan by months or years.',
    },
    {
      question: 'Should I pay off debt or invest instead?',
      answer:
        'A common rule of thumb is to prioritize paying down debt whose interest rate is higher than the return you could reasonably expect from investing. High-interest debt such as credit cards usually wins; for low-rate loans the maths is closer and depends on your goals and risk tolerance.',
    },
    {
      question: 'What is the difference between the avalanche and snowball methods?',
      answer:
        'The avalanche method targets the highest-interest debt first, which minimizes total interest paid. The snowball method targets the smallest balance first for quicker wins and motivation. Avalanche is cheaper mathematically; snowball can be easier to stick with.',
    },
    {
      question: 'Will extra payments always save money?',
      answer:
        'Almost always, but check for prepayment penalties on your loan agreement first, and make sure extra amounts are applied to principal rather than held as a prepaid future installment. Without a penalty, reducing principal early reliably lowers total interest.',
    },
  ],

  retirement: [
    {
      question: 'How much do I need to retire?',
      answer:
        'A widely used starting point is to aim for savings of roughly 25 times your expected annual retirement spending, which pairs with the idea of withdrawing about 4% in the first year. Your real target depends on your lifestyle, other income such as Social Security or a pension, and how long your retirement lasts.',
    },
    {
      question: 'What is the 4% rule?',
      answer:
        'The 4% rule is a guideline suggesting you can withdraw about 4% of your portfolio in your first year of retirement, then adjust that amount for inflation each year, with a reasonable chance the money lasts about 30 years. It is a rule of thumb, not a guarantee, and lower rates are often used to be safe.',
    },
    {
      question: 'How does inflation affect my retirement savings?',
      answer:
        'Inflation reduces what your money can buy over time, so a fixed amount of savings supports a lower standard of living the longer you live. Retirement planning should target inflation-adjusted spending, and investment growth needs to outpace inflation to preserve purchasing power.',
    },
    {
      question: 'When should I start saving for retirement?',
      answer:
        'As early as possible, because compounding rewards time more than amount. A smaller sum invested in your twenties can outgrow a larger sum started in your forties, since it has many more years to compound. If you start late, higher contributions can help close the gap.',
    },
  ],

  'auto-loan': [
    {
      question: 'How is an auto loan payment calculated?',
      answer:
        'Your monthly payment is based on the amount financed (vehicle price minus down payment and trade-in), the annual interest rate, and the loan term in months. The calculator uses the standard amortization formula so each payment covers interest first and the rest reduces your principal.',
    },
    {
      question: 'What is a good interest rate on a car loan?',
      answer:
        'Auto loan rates depend heavily on your credit score, the loan term, and whether the car is new or used. Borrowers with strong credit typically get the lowest rates, while longer terms and used vehicles usually carry higher rates. Compare offers from several lenders before committing.',
    },
    {
      question: 'Does a larger down payment reduce my car loan?',
      answer:
        'Yes. A larger down payment lowers the amount you finance, which reduces both your monthly payment and the total interest you pay. It can also help you avoid being "underwater" (owing more than the car is worth) early in the loan.',
    },
    {
      question: 'Should I choose a shorter or longer car loan term?',
      answer:
        'A shorter term means higher monthly payments but far less total interest and faster equity. A longer term lowers the monthly payment but costs more overall and keeps you in debt longer. Pick the shortest term whose payment comfortably fits your budget.',
    },
  ],

  'credit-card-payoff': [
    {
      question: 'How does this credit card payoff calculator work?',
      answer:
        'Enter your balance, your card\u2019s APR, and either a fixed monthly payment or a target payoff time. The calculator estimates how many months it will take to clear the balance and how much total interest you\u2019ll pay, so you can see the real cost of carrying a balance.',
    },
    {
      question: 'Why does paying only the minimum cost so much?',
      answer:
        'Minimum payments are set very low \u2014 often just above the monthly interest \u2014 so most of your payment goes to interest and the balance barely moves. At a typical ~22% APR, minimum-only payments can stretch a balance over a decade and cost more in interest than the original amount.',
    },
    {
      question: 'What is the fastest way to pay off credit card debt?',
      answer:
        'Pay as much above the minimum as you can, focus extra money on your highest-interest card first (the avalanche method), and stop adding new charges. A 0% balance-transfer card can also pause interest while you pay down the principal, if you qualify.',
    },
    {
      question: 'Does paying off a credit card help my credit score?',
      answer:
        'Usually yes. Paying down a balance lowers your credit utilization ratio \u2014 a major scoring factor \u2014 which often raises your score. Keep the card open after paying it off, since closing it reduces your available credit.',
    },
  ],

  savings: [
    {
      question: 'How does this savings calculator work?',
      answer:
        'Enter a starting amount, a regular monthly contribution, an annual interest rate (APY), and a time frame. The calculator compounds your balance over time and shows how much you\u2019ll have saved, separating your contributions from the interest earned.',
    },
    {
      question: 'What interest rate should I use?',
      answer:
        'Use the APY offered by the account you plan to use. A traditional savings account often pays well under 1%, while a high-yield savings account may pay around 4%. Because APY already includes compounding, it\u2019s the fairest number to compare accounts by.',
    },
    {
      question: 'How much should I save each month?',
      answer:
        'A common guideline is to save at least 20% of your income across goals, but any consistent amount helps. The calculator lets you test different monthly contributions so you can find a number that fits your budget and still reaches your goal.',
    },
    {
      question: 'Where should I keep my savings?',
      answer:
        'For money you may need soon \u2014 like an emergency fund \u2014 a high-yield savings account keeps it safe, liquid, and earning interest. For longer-term goals you might consider CDs or investments, which can earn more but carry lock-ups or market risk.',
    },
  ],

  'emergency-fund': [
    {
      question: 'How much should I have in an emergency fund?',
      answer:
        'A common target is three to six months of essential living expenses, but start with a smaller $500\u2013$1,000 starter fund first. Aim for the higher end (six months or more) if your income is variable or you\u2019re a sole earner.',
    },
    {
      question: 'How does this emergency fund calculator work?',
      answer:
        'Enter your essential monthly expenses (rent or mortgage, utilities, groceries, insurance, minimum debt payments) and how many months of coverage you want. The calculator multiplies them to show your target, and can show how long it takes to get there at a given monthly savings rate.',
    },
    {
      question: 'Where should I keep my emergency fund?',
      answer:
        'Keep it in a separate, FDIC-insured high-yield savings account \u2014 safe, liquid, and earning interest. Avoid tying emergency money up in CDs or investments, since you need to reach it instantly and without risk of loss when a surprise hits.',
    },
    {
      question: 'Should I build an emergency fund or pay off debt first?',
      answer:
        'Build a small $500\u2013$1,000 starter fund first so a surprise doesn\u2019t push you deeper into debt, then focus on high-interest debt, then return to building the full three-to-six-month fund.',
    },
  ],

  'roth-ira': [
    {
      question: 'How does this Roth IRA calculator work?',
      answer:
        'Enter your current age, retirement age, current balance, annual contribution, and an expected rate of return. The calculator compounds your contributions to retirement and shows your projected balance \u2014 which, in a Roth IRA, is generally tax-free to withdraw in retirement.',
    },
    {
      question: 'What are the Roth IRA contribution limits for 2026?',
      answer:
        'For 2026 you can contribute up to $7,500 if you\u2019re under 50, or $8,600 if you\u2019re 50 or older (a $1,100 catch-up). Contributions also phase out at higher incomes \u2014 for single filers with modified adjusted gross income between $153,000 and $168,000.',
    },
    {
      question: 'Why is Roth IRA growth tax-free?',
      answer:
        'You contribute money you\u2019ve already paid tax on, so qualified withdrawals in retirement \u2014 including all the growth \u2014 are tax-free, provided the account has been open at least five years and you\u2019re 59\u00bd or older. This makes the projected balance especially valuable.',
    },
    {
      question: 'Is a Roth IRA better than a 401(k)?',
      answer:
        'They serve different roles. A 401(k) offers an employer match and higher limits; a Roth IRA offers tax-free growth and flexibility. For most people the best approach is to capture the full 401(k) match first, then fund a Roth IRA.',
    },
  ],

  apy: [
    {
      question: 'What is APY?',
      answer:
        'APY (Annual Percentage Yield) is the real annual return on a deposit account after compounding is included. Because it accounts for how often interest compounds, it\u2019s the fairest single number for comparing savings accounts and CDs.',
    },
    {
      question: 'How does this APY calculator work?',
      answer:
        'Enter your deposit amount, the APY, and a time frame, and the calculator shows how much interest you\u2019ll earn and your ending balance. You can compare what different APYs earn on the same balance to see why chasing a higher rate matters.',
    },
    {
      question: 'What is the difference between APY and APR?',
      answer:
        'APY is what you earn on savings and includes compounding; APR is what you pay to borrow and, as a base rate, does not include compounding. For the same rate, APY is slightly higher than APR because of the compounding effect.',
    },
    {
      question: 'What is a good APY in 2026?',
      answer:
        'High-yield savings accounts have recently paid around 4% APY, versus a national average well under 1%. A good APY is one near the top of what online banks currently offer, with no monthly fees or high minimum balance requirements.',
    },
  ],
}
