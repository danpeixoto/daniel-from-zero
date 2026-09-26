import {
  BENCHMARK_INPUT,
  calculatePricing,
  roundCommercialPrice,
} from "../lib/pricing";

const r = calculatePricing(BENCHMARK_INPUT);

function approx(actual: number, expected: number, tol = 0.02) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

if (!r.valid) throw new Error(r.error ?? "invalid");
approx(r.costs.filament, 100);
approx(r.costs.electricity, 3.6);
approx(r.costs.machine, 45);
approx(r.costs.labor, 60);
approx(r.costs.additional, 25);
approx(r.costs.subtotal, 233.6);
approx(r.costs.total, 256.96);
approx(r.pricing.salePriceTotal, 428.27);
approx(r.pricing.salePricePerUnit, 8.5654, 0.01);
approx(roundCommercialPrice(8.5654), 8.6);

console.log("verify-pricing: OK");
