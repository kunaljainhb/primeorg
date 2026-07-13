import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Type, Heading1, Heading2, Link2 } from 'lucide-react';
import { Button } from './button';
import { Textarea } from './textarea';

export function RichTextEditor({ id, placeholder, rows, required, value: extValue, onChange }: any) {
  const [internalValue, setInternalValue] = useState('');
  
  const val = extValue !== undefined ? extValue : internalValue;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[var(--prime-primary-green)]/30 focus-within:border-[var(--prime-primary-green)] transition-all bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Type className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm">
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        id={id}
        rows={rows}
        className="border-0 focus-visible:ring-0 rounded-none resize-none text-sm p-4 bg-transparent shadow-none"
        placeholder={placeholder}
        required={required}
        value={val}
        onChange={handleChange}
      />
    </div>
  );
}
