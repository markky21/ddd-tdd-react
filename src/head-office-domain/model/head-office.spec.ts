import { HeadOffice } from "./head-office";
import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";

const getSUT = () => {
  return new HeadOffice("head-office-id");
};

test("adding money to head office", () => {
  const sut = getSUT();
  sut.addMoney(new Money(10, 10));
  expect(sut.getMoney().getTotalAmount()).toBe(1.1);
});

test("adding money to head office adds money to the previous state", () => {
  const sut = getSUT();
  sut.addMoney(new Money(10, 10));
  sut.addMoney(new Money(10, 10));
  expect(sut.getMoney().getTotalAmount()).toBe(2.2);
});

test("load balance set balance", () => {
  const sut = getSUT();
  sut.loadBalance(new Cash(10));
  expect(sut.getBalance().amount).toBe(10);
});

test("load balance overrides balance", () => {
  const sut = getSUT();
  sut.loadBalance(new Cash(10));
  sut.loadBalance(new Cash(10));
  expect(sut.getBalance().amount).toBe(10);
});

test("change balance adds balance to the previous state", () => {
  const sut = getSUT();
  sut.loadBalance(new Cash(10));
  sut.changeBalance(new Cash(10));
  expect(sut.getBalance().amount).toBe(20);
});
