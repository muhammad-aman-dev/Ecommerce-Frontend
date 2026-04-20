import ReactMarkdown from "react-markdown"

export default function ProductDescription({ description }) {
  return (
    <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl max-w-full wrap-break-word">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  )
}