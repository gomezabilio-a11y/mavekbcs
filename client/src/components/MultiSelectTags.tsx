import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { INDUSTRIES, SOLUTION_CATEGORIES } from "@/lib/siteData";

interface MultiSelectTagsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MultiSelectTags({ value, onChange }: MultiSelectTagsProps) {
  const [showIndustries, setShowIndustries] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const selectedTags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const toggleTag = (slug: string) => {
    if (selectedTags.includes(slug)) {
      onChange(selectedTags.filter((t) => t !== slug).join(", "));
    } else {
      onChange([...selectedTags, slug].join(", "));
    }
  };

  const removeTag = (slug: string) => {
    onChange(selectedTags.filter((t) => t !== slug).join(", "));
  };

  const getLabel = (slug: string) => {
    for (const ind of INDUSTRIES) {
      if (ind.slug === slug) return ind.name;
    }
    for (const cat of SOLUTION_CATEGORIES) {
      for (const sol of cat.solutions) {
        if (sol.slug === slug) return sol.name;
      }
    }
    return slug;
  };

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      <div
        className="flex flex-wrap gap-1.5 min-h-9 p-2 rounded-md border"
        style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        {selectedTags.length === 0 && (
          <span className="text-sm" style={{ color: "#4a5568" }}>
            Select industries or solutions below...
          </span>
        )}
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: "rgba(180,143,75,0.2)", color: "#b48f4b", border: "1px solid rgba(180,143,75,0.4)" }}
          >
            {getLabel(tag)}
            <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* Industries section */}
      <div className="rounded-md border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <button
          type="button"
          onClick={() => setShowIndustries(!showIndustries)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#8a9bb0" }}
        >
          <span>Industries</span>
          {showIndustries ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showIndustries && (
          <div className="flex flex-wrap gap-1.5 p-2" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
            {INDUSTRIES.map((ind) => {
              const selected = selectedTags.includes(ind.slug);
              return (
                <button
                  key={ind.slug}
                  type="button"
                  onClick={() => toggleTag(ind.slug)}
                  className="px-2 py-1 rounded text-xs font-medium transition-all"
                  style={
                    selected
                      ? { backgroundColor: "rgba(180,143,75,0.3)", color: "#b48f4b", border: "1px solid rgba(180,143,75,0.6)" }
                      : { backgroundColor: "rgba(255,255,255,0.05)", color: "#8a9bb0", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  {selected && "✓ "}{ind.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Solutions section */}
      <div className="rounded-md border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <button
          type="button"
          onClick={() => setShowSolutions(!showSolutions)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#8a9bb0" }}
        >
          <span>Solutions</span>
          {showSolutions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showSolutions && (
          <div className="p-2 space-y-2" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
            {SOLUTION_CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <div className="text-xs font-semibold mb-1 px-1" style={{ color: "#6b7a8d" }}>
                  {cat.name}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.solutions.map((sol) => {
                    const selected = selectedTags.includes(sol.slug);
                    return (
                      <button
                        key={sol.slug}
                        type="button"
                        onClick={() => toggleTag(sol.slug)}
                        className="px-2 py-1 rounded text-xs font-medium transition-all"
                        style={
                          selected
                            ? { backgroundColor: "rgba(180,143,75,0.3)", color: "#b48f4b", border: "1px solid rgba(180,143,75,0.6)" }
                            : { backgroundColor: "rgba(255,255,255,0.05)", color: "#8a9bb0", border: "1px solid rgba(255,255,255,0.1)" }
                        }
                      >
                        {selected && "✓ "}{sol.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
