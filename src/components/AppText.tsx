import React, { Children, forwardRef, isValidElement, type ReactNode } from "react";
import { Platform, StyleSheet, Text as NativeText, type TextProps, type TextStyle } from "react-native";
import { fonts } from "../theme";

// NFC also covers Vietnamese text supplied with decomposed tone marks.
const vietnameseLetters = /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯư\u1EA0-\u1EF9]/;
const nativeFont = Platform.select({ ios: "System", android: "sans-serif", default: "system-ui" });

function textContent(children: ReactNode): string {
  return Children.toArray(children).map((child): string => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return textContent(child.props.children);
    return "";
  }).join("");
}

const AppText = forwardRef<NativeText, TextProps>(function AppText({ children, style, ...props }, ref) {
  let nativeStyle: TextStyle | undefined;
  if (vietnameseLetters.test(textContent(children).normalize("NFC"))) {
    const current = StyleSheet.flatten(style);
    nativeStyle = {
      fontFamily: nativeFont,
      fontWeight: current?.fontWeight ?? (
        current?.fontFamily === fonts.bodyBold ? "700" :
        current?.fontFamily === fonts.bodySemi ? "600" : "400"
      ),
    };
  }
  return <NativeText ref={ref} {...props} style={nativeStyle ? [style, nativeStyle] : style}>{children}</NativeText>;
});

export default AppText;
