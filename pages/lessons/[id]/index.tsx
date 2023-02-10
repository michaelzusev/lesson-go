import { PrinterIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import MainLayout from "../../../components/MainLayout";
import { Database } from "../../../supabase/database.types";
import { Lesson } from "../../../utils/types";
import { gradeValues, SectionTypes } from "../new";

function ViewLessonPage({ lesson }: { lesson: Lesson }) {
  const content = lesson.content as SectionTypes;
  return (
    <div className="max-w-4xl px-6 mx-auto">
      <Head>
        <title>{lesson?.title} Lesson Plan | Lesson Go</title>
      </Head>
      <div className="flex flex-row items-center">
        <h1 className="mb-3 text-4xl capitalize">{lesson?.title}</h1>
        <button
          onClick={() => window.print()}
          className="flex flex-row items-center self-center gap-3 px-4 py-2 ml-auto font-medium text-white bg-black whitespace-nowrap print:hidden rounded-xl hover:bg-black/80"
        >
          <PrinterIcon width={24} />
          Print
        </button>
      </div>
      <div className="text-xl text-gray-600">
        {lesson.grade
          ?.map((g) => gradeValues.find((v) => v.value === g)?.label)
          .join(", ")}{" "}
        {lesson.subject?.join(", ")}
      </div>
      <div className="mt-8 prose prose-slate">
        <h2 className="">Learning Objectives</h2>
        <div className="">
          {content?.objectives?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>

        <h2 className="">Materials</h2>
        <div className="">
          {content?.materials?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>
        <h2 className="">Direct Instruction</h2>
        <div className="">
          {content?.instructions?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>
        <h2 className="">Guided Practice</h2>
        <div className="">
          {content?.practice?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>
        <h2 className="">Differentiation</h2>
        <div className="">
          {content?.differentiation?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewLessonPage;

ViewLessonPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", ctx.params?.id)
    .single();

  return {
    props: {
      lesson: data,
    },
  };
};
