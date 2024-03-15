// import {
//   Dispatch,
//   FormEvent,
//   ForwardedRef,
//   HTMLProps,
//   PropsWithChildren,
//   SetStateAction,
//   forwardRef,
// } from "react";

// type paragraphProps = HTMLProps<HTMLParagraphElement>;
// type EmojiPickerProps = {

// };
// const EmojiPicker = forwardRef<
//   HTMLParagraphElement,
//   PropsWithChildren<EmojiPickerProps>
// >(function EmojiPicker(props, textInputRef) {
//   const { setEmojiPicker, sendMessage } = props;
//   return (
//     <div
//       onMouseLeave={() => {
//         setEmojiPicker(false);
//       }}
//       style={{ right: "3dvw", bottom: "50px" }}
//       className="absolute    z-50"
//       onClick={(e) => e.stopPropagation()}
//       onKeyDown={(e) => {
//         if (e.key === "Enter") sendMessage(e);
//       }}
//     >
//       <Picker
//         onEmojiSelect={(e: any) => {
//           if (textInputRef && textInputRef.current) {
//             if (textInputRef.current.innerText === "type...")
//               textInputRef.current.innerText = "";

//             textInputRef.current.innerText += e.native;
//           }
//         }}
//       />
//     </div>
//   );
// });

// EmojiPicker.displayName = "EmojiPicker";

// export default EmojiPicker;
