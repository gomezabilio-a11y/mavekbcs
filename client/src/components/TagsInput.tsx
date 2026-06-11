import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { INDUSTRIES, SOLUTION_CATEGORIES } from "@/lib/siteData";

// Generate available tags from industries and solutions
const generateAvailableTags = () => {
  const tags: string[] = [];
  
  // Add all industry slugs
  INDUSTRIES.forEach((ind) => {
    tags.push(ind.slug);
  });
  
  // Add all solution slugs
  SOLUTION_CATEGORIES.forEach((cat) => {
    cat.solutions.forEach((sol) => {
      tags.push(sol.slug);
    });
  });
  
  return tags;
};

const AVAILABLE_TAGS = generateAvailableTags();

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TagsInput({ value, onChange, placeholder = "Add tags..." }: TagsInputProps) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(
    () =>
      value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [value]
  );

  const filteredTags = useMemo(() => {
    if (input.length === 0) return [];
    return AVAILABLE_TAGS.filter(
      (tag) =>
        tag.toLowerCase().includes(input.toLowerCase()) &&
        !tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }, [input, tags]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = useCallback(
    (tag: string) => {
      const newTags = [...tags, tag];
      onChange(newTags.join(", "));
      setInput("");
      setShowDropdown(false);
      inputRef.current?.focus();
    },
    [tags, onChange]
  );

  const handleRemoveTag = useCallback(
    (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      onChange(newTags.join(", "));
    },
    [tags, onChange]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && input.trim()) {
        e.preventDefault();
        handleAddTag(input.trim());
      } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
        handleRemoveTag(tags.length - 1);
      }
    },
    [input, tags.length, handleAddTag, handleRemoveTag]
  );

  const handleInputFocus = useCallback(() => {
    if (input.length > 0 && filteredTags.length > 0) {
      // Calculate position for dropdown
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setShowDropdown(true);
    }
  }, [input, filteredTags.length]);

  return (
    <>
      <div ref={containerRef} className="relative">
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10">
          {tags.map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 outline-none text-sm min-w-24 bg-transparent"
          />
        </div>
      </div>

      {showDropdown && filteredTags.length > 0 &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
            className="mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[9999] max-h-48 overflow-y-auto"
          >
            {filteredTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
              >
                {tag}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
