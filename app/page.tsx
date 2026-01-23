import BackgroundImage from "@/components/background-image";
import H1 from "@/components/h1";
import TextInput from "@/components/textInput";

export default function Home() {
  return (
    <>
      <div className="h-dvh flex flex-col">
        <BackgroundImage />
        <div className="z-10">
          <H1>Comparative Essay Checker</H1>
          <TextInput />
        </div>
      </div>
    </>
  );
}
