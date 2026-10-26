import React, { type ReactNode } from "react";
import { PickScreenView } from "../PickScreen";
import { DISH_BY_ID } from "../../data/dishes";

jest.mock("react-native", () => ({
  Pressable: "Pressable", ScrollView: "ScrollView", View: "View",
  StyleSheet: { create: (styles: unknown) => styles },
}));
jest.mock("../../components/AppText", () => "Text");

type NodeProps = { children?: ReactNode; onPress?: () => void };
function textOf(node: ReactNode): string {
  return React.Children.toArray(node).map((child): string => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    return React.isValidElement<NodeProps>(child) ? textOf(child.props.children) : "";
  }).join("");
}
function button(node: ReactNode, label: string): (() => void) | undefined {
  for (const child of React.Children.toArray(node)) {
    if (!React.isValidElement<NodeProps>(child)) continue;
    if (child.type === "Pressable" && textOf(child) === label) return child.props.onPress;
    const found = button(child.props.children, label);
    if (found) return found;
  }
}
function render(overrides: Partial<Parameters<typeof PickScreenView>[0]> = {}) {
  return PickScreenView({ dish: DISH_BY_ID["pho-bo"], inventory: {}, initialPick: [], pick: [], onToggle: jest.fn(), onDone: jest.fn(), onBack: jest.fn(), onMarket: jest.fn(), ...overrides });
}

test("picking displays whole portions and never offers out-of-stock ingredients for a new cook", () => {
  const onToggle = jest.fn();
  const view = render({ inventory: { chicken: 3, shrimp: 0 }, onToggle });
  expect(textOf(view)).toContain("Chicken · 3 in stock");
  expect(button(view, "Shrimp · 0 in stock")).toBeUndefined();
  button(view, "Chicken · 3 in stock")!();
  expect(onToggle).toHaveBeenCalledWith("chicken");
});

test("buying several portions still submits a single ingredient choice to cooking and scoring", () => {
  const onDone = jest.fn();
  const view = render({ inventory: { chicken: 5 }, pick: ["chicken"], onDone });
  button(view, "Cook →")!();
  expect(onDone).toHaveBeenCalledWith(["chicken"]);
});

test("free guidance retains the consumed attempt's ingredients even when none remain in storage", () => {
  const onDone = jest.fn();
  const view = render({ inventory: {}, repair: true, initialPick: ["chicken"], pick: ["chicken"], onDone });
  expect(textOf(view)).toContain("Chicken · 0 in stock · from this attempt");
  expect(textOf(view)).toContain("no additional portions");
  button(view, "Show the owner →")!();
  expect(onDone).toHaveBeenCalledWith(["chicken"]);
});
