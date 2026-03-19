"use client";

import { Button } from "./ui/button";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AllFeedback, essaySchema, IntroContext, TEssaySchema } from "@/lib/types";
import TipsBlock from "./tips-block";
import { downloadFeedbackDocx } from "@/app/features/generateFile";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2 } from "lucide-react";

const fieldLabels: Record<keyof TEssaySchema, string> = {
  intro: "Introductory Paragraph",
  body1: "Body Paragraph 1",
  body2: "Body Paragraph 2",
  body3: "Body Paragraph 3",
  conc: "Concluding Paragraph",
};

function TextInput() {
  const [missingOpen, setMissingOpen] = useState(false);
  const [missingKeys, setMissingKeys] = useState<(keyof TEssaySchema)[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: {
      // errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(essaySchema),
  });
  const postJsonOrThrow = async <T,>(
    endpoint: string,
    payload: unknown,
  ): Promise<T> => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      const message =
        typeof json?.error === "string"
          ? json.error
          : `Request failed: ${res.status}`;
      throw new Error(`${endpoint}: ${message}`);
    }

    return json as T;
  };

  const fetchParagraphGrammar = async (paragraph: string) => {
    return postJsonOrThrow<{ grammarFeedback: string }>(
      "/api/paragraph-grammar",
      { paragraph },
    );
  };

  const fetchParagraphContent = async <T,>(
    endpoint: string,
    paragraph: string,
    introContext: IntroContext,
  ): Promise<T> => {
    return postJsonOrThrow<T>(endpoint, {
      paragraph,
      introContext,
    });
  };


  // const fieldLabels: Record<keyof TEssaySchema, string> = {
  //   intro: "Introductory Paragraph",
  //   body1: "Body Paragraph 1",
  //   body2: "Body Paragraph 2",
  //   body3: "Body Paragraph 3",
  //   conc: "Concluding Paragraph",
  // };
  type IntroStructureResponse = {
    structureFeedback: string;
  };

  type IntroGrammarResponse = {
    grammarFeedback: string;
  };

  type IntroContextResponse = IntroContext;

  const fetchIntroCheck = async <T,>(
    endpoint: string,
    intro: string,
  ): Promise<T> => {
    return postJsonOrThrow<T>(endpoint, { intro });
  };


  const onInvalid = (errs: FieldErrors<TEssaySchema>) => {
    const keys = Object.keys(errs) as (keyof TEssaySchema)[];
    setMissingKeys(keys);
    setMissingOpen(true);
  };


  const onSubmit = async (data: TEssaySchema) => {
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const structureJson = await fetchIntroCheck<IntroStructureResponse>(
        "/api/content",
        data.intro,
      );

      const grammarJson = await fetchIntroCheck<IntroGrammarResponse>(
        "/api/grammar",
        data.intro,
      );

      const contextJson = await fetchIntroCheck<IntroContextResponse>(
        "/api/context",
        data.intro,
      );

      // 1
      const body1StructureJson = await fetchParagraphContent<{
        body1StructureFeedback: string;
      }>("/api/body1-content", data.body1, contextJson);

      const body1GrammarJson = await fetchParagraphGrammar(data.body1);


      // 2
      const body2StructureJson = await fetchParagraphContent<{
        body2StructureFeedback: string;
      }>("/api/body2-content", data.body2, contextJson);

      const body2GrammarJson = await fetchParagraphGrammar(data.body2);



      // 3

      const body3StructureJson = await fetchParagraphContent<{
        body3StructureFeedback: string;
      }>("/api/body3-content", data.body3, contextJson);
      const body3GrammarJson = await fetchParagraphGrammar(data.body3);

      //conc

      const concJson = await fetchParagraphContent<{
        concStructureFeedback: string;
      }>("/api/concluding", data.conc, contextJson);

      const concGrammarJson = await fetchParagraphGrammar(data.conc);

      const all: AllFeedback = {
        content: {
          intro: structureJson.structureFeedback ?? "",
          body1: body1StructureJson.body1StructureFeedback ?? "",
          body2: body2StructureJson.body2StructureFeedback ?? "",
          body3: body3StructureJson.body3StructureFeedback ?? "",
          conc: concJson.concStructureFeedback ?? "",
        },
        grammar: {
          intro: grammarJson.grammarFeedback ?? "",
          body1: body1GrammarJson.grammarFeedback ?? "",
          body2: body2GrammarJson.grammarFeedback ?? "",
          body3: body3GrammarJson.grammarFeedback ?? "",
          conc: concGrammarJson.grammarFeedback ?? "",
        },
      };
      downloadFeedbackDocx(all, "comparative-essay-feedback.docx");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while generating feedback.";

      setSubmitError(message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-3/4 max-w-5xl mx-auto px-2.5">
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-4"
        >
          <div
            className="flex flex-col gap-2 p-5 bg-white rounded-[7px]"
            translate="no"
          >
            <div className="flex flex-col gap-2">
              {/* LEFT COLUMN: textarea + buttons */}
              <div className=" flex flex-col w-full gap-2  ">
                <TipsBlock title="Introductory Paragraph">
                  <ul className="list-decimal pl-6 space-y-1">
                    <li>比較される主題を名前付ける</li>
                    <li>
                      Essay
                      が類似点に焦点を当てるのか、それとも相違点に焦点を当てるのかを明確に示すべき
                    </li>
                    <li>
                      Body Paragraphs で議論される比較点(Point of
                      Comparison)をリストアップする
                    </li>
                  </ul>
                </TipsBlock>
                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-col border-[#ccc] h-full">
                    <textarea
                      id="message"
                      {...register("intro")}
                      spellCheck="false"
                      className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                      placeholder="Write Introductory Paragraph here."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* LEFT COLUMN: textarea + buttons */}
              <div className=" flex flex-col w-full gap-2  ">
                <TipsBlock title="Body Paragraph 1">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Topic Sentenceで始まる（比較のポイントを述べる）</li>
                    <li>主題Aの比較点について議論する</li>
                    <li>
                      主題Bの比較点について議論する
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          類似または対照を示すディスコースマーカーを加える。
                        </li>
                      </ul>
                    </li>
                  </ul>
                </TipsBlock>
                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-col border-[#ccc] h-full">
                    <textarea
                      id="message"
                      {...register("body1")}
                      spellCheck="false"
                      className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                      placeholder="Write Body Paragraph 1 here."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* LEFT COLUMN: textarea + buttons */}
              <div className=" flex flex-col w-full gap-2  ">
                <TipsBlock title="Body Paragraph 2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Topic Sentenceで始まる（比較のポイントを述べる）</li>
                    <li>主題Aの比較点について議論する</li>
                    <li>
                      主題Bの比較点について議論する
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          類似または対照を示すディスコースマーカーを加える。
                        </li>
                      </ul>
                    </li>
                  </ul>
                </TipsBlock>
                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-col border-[#ccc] h-full">
                    <textarea
                      id="message"
                      {...register("body2")}
                      spellCheck="false"
                      className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                      placeholder="Write Body Paragraph 2 here."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* LEFT COLUMN: textarea + buttons */}
              <div className=" flex flex-col w-full gap-2  ">
                <TipsBlock title="Body Paragraph 3">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Topic Sentenceで始まる（比較のポイントを述べる）</li>
                    <li>主題Aの比較点について議論する</li>
                    <li>
                      主題Bの比較点について議論する
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          類似または対照を示すディスコースマーカーを加える。
                        </li>
                      </ul>
                    </li>
                  </ul>
                </TipsBlock>
                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-col border-[#ccc] h-full">
                    <textarea
                      id="message"
                      {...register("body3")}
                      spellCheck="false"
                      className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                      placeholder="Write Body Paragraph 3 here."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* LEFT COLUMN: textarea + buttons */}
              <div className=" flex flex-col w-full gap-2  ">
                <TipsBlock title="Concluding Paragraph">
                  <p className="font-bold text-lg">Concluding Paragraph</p>
                  <ul className="list-disc pl-6">
                    <li>
                      <ul className="list-disc pl-6">
                        <li>テーゼの再述</li>
                        <li>類似点と相違点の要約</li>
                        <li>洞察または発見についてのコメント</li>
                      </ul>
                    </li>
                  </ul>
                </TipsBlock>
                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-col border-[#ccc] h-full">
                    <textarea
                      id="message"
                      {...register("conc")}
                      spellCheck="false"
                      className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                      placeholder="Write Concluding Paragraph here."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            {submitError && (
              <div className="rounded-[5px] border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div className="flex gap-1 justify-center">
              <Button
                className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100"
                disabled={isSubmitting}
                type="submit"
              >
                Check
              </Button>
            </div>
            <AlertDialog open={missingOpen} onOpenChange={setMissingOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    いくつかの部分が未入力です
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    「チェック」を押す前に、次の部分を入力してください。
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <ul className="list-disc pl-6">
                  {missingKeys.map((k) => (
                    <li key={k}>{fieldLabels[k]}</li>
                  ))}
                </ul>

                <AlertDialogFooter>
                  <AlertDialogCancel>閉じる</AlertDialogCancel>
                  {missingKeys[0] && (
                    <AlertDialogAction
                      onClick={() => {
                        const first = missingKeys[0];
                        setMissingOpen(false);
                        setTimeout(() => setFocus(first), 0);
                      }}
                    >
                      どれか1つでも空だと、チェックできません。
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
        <footer className="text-xs">© Jihan V. 2026</footer>
        <footer className="text-xs">Comparative Essay Checker</footer>
        <Dialog open={isSubmitting}>
          <DialogContent
            className="sm:max-w-md"
            // hides the X button (DialogContent renders a close button by default)
            // if your shadcn version supports it:
            // closeButton={false}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                テストを作成しています…
              </DialogTitle>
              <DialogDescription>
                Please wait—don’t close this tab/window while we generate
                feedback.
                フィードバックを作成しています。完了するまで、このタブ／ウィンドウを閉じないでください。。
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default TextInput;
