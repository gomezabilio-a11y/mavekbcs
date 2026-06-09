import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

// All available tags from insightMapping
const AVAILABLE_TAGS = [
  "SAP", "Oracle", "Blackline", "Automation", "AI", "Cloud",
  "Financial Close", "Planning", "Budgeting", "Tax", "Compliance", "Treasury",
  "Billing", "Revenue", "Risk", "Lease", "Finance Transformation",
  "Semiconductors", "Automotive", "Pharma", "Telecom", "Energy",
  "Renewable", "Banking", "Real Estate", "Retail", "Utilities",
  "Electronics", "Manufacturing", "E-commerce", "CFO", "R&D",
  "Commodity Risk", "Finance", "Intercompany", "Inventory",
  "IP Licensing", "Digital", "Innovation", "Strategy", "Efficiency",
];

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TagsInput({ value, onChange, placeholder = "Add tags..." }: TagsInputProps) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  useEffect(() => {
    if (input.length > 0) {
      const filtered = AVAILABLE_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(input.toLowerCase()) &&
          !tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
      setFilteredTags(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredTags([]);
      setShowDropdown(false);
    }
  }, [input, tags]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = (tag: string) => {
    const newTags = [...tags, tag];
    onChange(newTags.join(", "));
    setInput("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags.join(", "));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      handleAddTag(input.trim());
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10">
        {tags.map((tag, index) => (
          <div
            key={index}
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
          onFocus={() => input.length > 0 && setShowDropdown(true)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 outline-none text-sm min-w-24 bg-transparent"
        />
      </div>

      {showDropdown && filteredTags.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
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
        </div>
      )}
    </div>
  );
}
