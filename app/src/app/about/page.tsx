export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl p-4 md:py-8 md:px-0">
      <h1 className="text-3xl font-bold">About Fairpay</h1>
      <section className="space-y-4 mt-4">
        <div className="p-2 md:p-4 border-t border-border/80">
          <h2 className="text-2xl font-semibold">What is Fairpay?</h2>
          <p>
            Fairpay is a decentralized crowdfunding platform that allows athletes to raise funds to
            help their careers. It is built on the blockchain Base for its efficiency, security and
            low costs. Fairpay only accepts payments in USDC to ensure that the funds have a stable
            value and can be used by the athletes in the simplest way possible. Fairpay was
            conceived to be used by athletes registered on Farcaster, to allow them to easily
            communicate about their campaigns and be more than just a faceless wallet address.
          </p>
        </div>
        <div className="p-2 md:p-4 border-t border-border/80">
          <h2 className="text-2xl font-semibold">What is Farcaster?</h2>
          <p>
            Farcaster is an innovative, sufficiently decentralized protocol for social networking.
            In short, it&apos;s sort of a mix between X and Reddit, but with onchain capabilities
            infused into it, truly putting it in a league of its own. The way Fairpay uses Farcaster
            is by only allowing Farcaster users to be the recipient of a campaign. This way, the
            athlete can easily communicate with their supporters and keep them updated on their
            goals, achievements and more, whilst being able to prove that they indeed receive the
            funds, through their public custody/verified Farcaster wallet.
          </p>
        </div>
        <div className="p-2 md:p-4 border-t border-border/80">
          <h2 className="text-2xl font-semibold">What is a Smart Wallet?</h2>
          <p>
            Fairpay&apos;s goal is to make Web3 feel like Web2 on steroids. To achieve this, we have
            to abstract away the complexities of the blockchain from the user. One of the ways we do
            this is by using Coinbase&apos;s Smart Wallet and their gasless services. The Smart
            Wallet is a crypto wallet that can act like a regular wallet, but with the added benefit
            of being able to interact with the blockchain without the user having to pay for gas and
            do complex operations.
          </p>
        </div>
        <div className="p-2 md:p-4 border-t border-border/80">
          <h2 className="text-2xl font-semibold">Why do it onchain?</h2>
          <p>
            Building Fairpay onchain was not a second thought, it was actually the spark that lit
            the fire. By building Fairpay onchain, we can ensure a degree of transparency, security,
            decentralization and efficiency that would be impossible to achieve with traditional
            Web2 technologies. This way, we can ensure that the funds go directly to the athlete,
            without any middlemen holding the funds hostage, and that the funds are used for the
            intended purpose. We can also ensure that the funds are safe from hackers and that the
            platform is always available, no matter what.
          </p>
        </div>
      </section>
    </main>
  );
}
