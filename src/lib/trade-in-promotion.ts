export type TradeInPromotion = { id: string; label: string; description: string; creditBonusPercent: number; startsAt?: Date; endsAt?: Date };
export function getActiveTradeInPromotion(now = new Date()): TradeInPromotion | null {
  if (process.env.TRADE_IN_PROMOTION_ENABLED === 'false') return null;
  const startsAt = process.env.TRADE_IN_PROMOTION_STARTS_AT ? new Date(process.env.TRADE_IN_PROMOTION_STARTS_AT) : undefined;
  const endsAt = process.env.TRADE_IN_PROMOTION_ENDS_AT ? new Date(process.env.TRADE_IN_PROMOTION_ENDS_AT) : undefined;
  if (startsAt && (!Number.isFinite(startsAt.getTime()) || now < startsAt)) return null;
  if (endsAt && (!Number.isFinite(endsAt.getTime()) || now >= endsAt)) return null;
  const creditBonusPercent = Math.max(0, Math.min(100, Number(process.env.TRADE_IN_CREDIT_BONUS_PERCENT || 10)));
  return {
    id: process.env.TRADE_IN_PROMOTION_ID || 'store-credit-bonus',
    label: process.env.TRADE_IN_PROMOTION_LABEL || `Get ${creditBonusPercent}% more in store credit`,
    description: process.env.TRADE_IN_PROMOTION_DESCRIPTION || 'Choose store credit after inspection and we will add the current bonus to your final cash value.',
    creditBonusPercent,
    startsAt,
    endsAt
  };
}