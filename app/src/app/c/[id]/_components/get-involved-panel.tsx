import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Progress } from "@/shared/components/ui/progress";

export function GetInvolvedPanel() {
  return (
    <section className="col-span-1 rounded-lg border border-yellow-200 p-4 bg-yellow-50 self-start flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Get involved</h2>
        <div>
          <p className="text-lg">Collected so far:</p>
          <p className="text-3xl text-center font-bold py-2">1000 USD</p>
          <div className="space-y-1">
            <Progress value={50} />
            <p className="text-center text-sm">Target: 2000 USD</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-lg">Contribute:</p>
          <Input type="number" placeholder="Amount" className="w-full text-center" />
          <Button type="submit" size={"lg"} className="w-full">
            Support
          </Button>
        </div>
      </div>
      <hr className="my-3 border border-border/40" />
      <div>
        <Button type="submit" size={"lg"} variant={"secondary"} className="w-full">
          Share
        </Button>
      </div>
    </section>
  );
}
