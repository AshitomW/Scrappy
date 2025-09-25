import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helpers/waitFor";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactCountWrapper from "@/components/ReactCountUpWrapper";
import { ArrowLeftRight, ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import GetCreditsUsageStats from "@/actions/analytics/getCreditsUsageStats";
import CreditsUsageChart from "./_components/CreditUsageChart";
import { GetUserTransactionHistory } from "@/actions/analytics/GetUserTransactionHistory";
import InvoiceButton from "./_components/InvoiceButton";

export default function BillingPage() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

export async function BalanceCard() {
  const userBalace = await GetAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountWrapper value={userBalace} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credit balance reaches zero, your workflows will stop working.
      </CardFooter>
    </Card>
  );
}

async function CreditUsageCard() {
  const period: Period = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };
  const data = await GetCreditsUsageStats(period);
  console.log(data);
  return (
    <CreditsUsageChart
      data={data}
      title="Credits Consumed"
      description="Daily Credits Consumed In Current Month"
    />
  );
}

async function TransactionHistoryCard() {
  const purchases = await GetUserTransactionHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold items-center gap-2 flex">
          <ArrowLeftRightIcon className="h-6 w-6" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No Transactions Yet</p>
        )}
        {purchases.map((purchase) => {
          return (
            <div
              key={purchase.id}
              className="flex justify-between items-center py-3 border-bl last:border-b-0"
            >
              <div>
                <p className="font-bold">{formatDate(purchase.date)}</p>
                <p className="text-sm text-muted-foreground">
                  {purchase.description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {formatAmount(purchase.amount, purchase.currency)}
                </p>
                <InvoiceButton id={purchase.id} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
