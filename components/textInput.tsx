"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EssayCheckResponse, essaySchema, SentenceSuccessResponse, TEssaySchema } from "@/lib/types";
import TipsBlock from "./tips-block";

function TextInput() {


    const {
        register,
        handleSubmit,
        formState: {
            // errors,
            isSubmitting
        }

    } = useForm({
        resolver: zodResolver(essaySchema)
    });
    const [output, setOuput] = useState("")

    const onSubmit = async (data: TEssaySchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const structureRes = await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ intro: data.intro }),
        });
        const structureJson = await structureRes.json();

        const grammarRes = await fetch("/api/grammar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ intro: data.intro }),
        });
        const grammarJson = await grammarRes.json();

        console.log(structureJson.structureFeedback);
        console.log(grammarJson.grammarFeedback);
    };

    return (
        <>
            <div
                className="flex flex-col justify-center w-3/4 max-w-5xl mx-auto px-2.5"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                        <li>Essay が類似点に焦点を当てるのか、それとも相違点に焦点を当てるのかを明確に示すべき</li>
                                        <li>Body Paragraphs で議論される比較点(Point of Comparison)をリストアップする</li>
                                    </ul>
                                </TipsBlock>
                                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                                    <div className="flex flex-col border-[#ccc] h-full">
                                        <textarea
                                            id="message"
                                            {...register("intro")}
                                            spellCheck="false"
                                            className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                                            placeholder="Paste the comparative essay here."
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
                                                <li>類似または対照を示すディスコースマーカーを加える。</li>
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
                                            placeholder="Paste the comparative essay here."
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
                                                <li>類似または対照を示すディスコースマーカーを加える。</li>
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
                                            placeholder="Paste the comparative essay here."
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
                                        <ul className="list-disc pl-6">
                                            <li>テーゼの再述</li>
                                            <li>類似点と相違点の要約</li>
                                            <li>洞察または発見についてのコメント </li>
                                        </ul>
                                    </ul>
                                </TipsBlock>
                                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                                    <div className="flex flex-col border-[#ccc] h-full">
                                        <textarea
                                            id="message"
                                            {...register("conc")}
                                            spellCheck="false"
                                            className="h-[20vh] w-full border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5"
                                            placeholder="Paste the comparative essay here."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 justify-center">
                            <Button
                                className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                Check
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default TextInput;
