import { SDKInitOptions, SDKProvider } from "@tma.js/sdk-react";
/** @ts-expect-error  asd */
import App from './App'


export const Root: React.FC = () => {
  const options: SDKInitOptions = {
    acceptCustomStyles: true,
    cssVars: true,
  };


  return (
    <SDKProvider options={options}>
      <App />
    </SDKProvider>
  )
}