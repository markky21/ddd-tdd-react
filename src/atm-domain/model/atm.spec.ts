import { Money } from "../../shared-kernel/value-objects/money";
import { Atm } from "./atm";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { expect } from "vitest";
import { nanoid } from "nanoid";

const getSUT = () => {
  const atm = new Atm(nanoid());
  return { atm };
};

test("take money exchange money with commission", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.Dollar());

  atm.takeMoney(new Cash(1));

  expect(atm.getMoneyInside()).toEqual(Money.None());
  expect(atm.getMoneyCharged()).toEqual(new Cash(1.01));
});

test("commission is 1% of amount", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.FiveDollar());

  atm.takeMoney(new Cash(5));

  expect(atm.getMoneyCharged()).toEqual(new Cash(5.05));
});

test("commission is rounded up to the cent", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.OneCent());

  atm.takeMoney(new Cash(0.01));

  expect(atm.getMoneyCharged()).toEqual(new Cash(0.02));
});

test("canTakeMoney gives message when there is invalid amount to take", () => {
  const { atm } = getSUT();

  expect(atm.canTakeMoney(Cash.None)).toEqual("Invalid amount to take");
});

test("canTakeMoney gives message when there not enough money inside", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.OneCent());

  expect(atm.canTakeMoney(new Cash(1))).toEqual(
    "There is not enough money in the ATM"
  );
});

test("canTakeMoney gives message when there not enough money to allocate", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.Dollar());

  expect(atm.canTakeMoney(new Cash(0.5))).toEqual(
    "Not enough money to allocate"
  );
});

test("throws when trying to take none money", () => {
  const { atm } = getSUT();

  expect(() => atm.takeMoney(Cash.None)).toThrowError("Invalid amount to take");
});

test("throws when trying to take more money than is in machine", () => {
  const { atm } = getSUT();

  expect(() => atm.takeMoney(new Cash(1))).toThrowError(
    "There is not enough money in the ATM"
  );
});

test("throws when trying to take money and can't allocate", () => {
  const { atm } = getSUT();
  atm.loadMoney(Money.Dollar());

  expect(() => atm.takeMoney(new Cash(0.5))).toThrowError(
    "Not enough money to allocate"
  );
});
