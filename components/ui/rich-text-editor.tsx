'use client';

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
// Bubble button component for the editor toolbar
const BubbleButton = ({
  className,
  active,
  title,
  children,
  ...props
}: {
  className?: string;
  active?: boolean;
  title: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      className={cn(
        'p-1.5 rounded hover:bg-gray-100',
        active ? 'bg-gray-200' : '',
        className
      )}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Write something amazing...',
  className,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        dropcursor: {
          color: '#3B82F6',
          width: 2,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border mx-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Typography,
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 my-4',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      Underline,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-md font-mono text-sm',
        },
      }),
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 min-h-[200px]',
          'border rounded-lg',
          editable ? 'bg-white' : 'bg-gray-50',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable,
  });

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      {editable && (
        <div className="flex flex-wrap gap-1 p-1 border rounded-t-lg bg-gray-50">
          {/* Text Formatting */}
          <div className="flex items-center border-r pr-2 mr-2">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <span className="font-bold">B</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <span className="italic">I</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline"
            >
              <span className="underline">U</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              title="Strikethrough"
            >
              <span className="line-through">S</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              title="Code"
            >
              <code>{`{"}"`}</code>
            </BubbleButton>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r pr-2 mr-2">
            <BubbleButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align left"
            >
              <span>≡</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align center"
            >
              <span>≡</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align right"
            >
              <span>≡</span>
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <span>≡</span>
            </BubbleButton>
          </div>

          {/* Headings */}
          <div className="flex items-center border-r pr-2 mr-2">
            <select
              className="text-sm border rounded p-1 bg-white"
              value={editor.getAttributes('heading')?.level || 'paragraph'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'paragraph') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
            >
              <option value="paragraph">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r pr-2 mr-2">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              •
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              1.
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleList('bulletList', 'listItem').run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              •
            </BubbleButton>
          </div>

          {/* Blocks */}
          <div className="flex items-center border-r pr-2 mr-2">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Blockquote"
            >
              "
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              title="Code Block"
            >
              &lt;/&gt;
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              —
            </BubbleButton>
          </div>

          {/* Insert */}
          <div className="flex items-center">
            <BubbleButton onClick={addImage} title="Insert Image">
              <span>🖼️</span>
            </BubbleButton>
            <BubbleButton onClick={setLink} title="Add Link">
              <span>🔗</span>
            </BubbleButton>
            <BubbleButton onClick={addTable} title="Insert Table">
              <span>📊</span>
            </BubbleButton>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="min-h-[200px]" />
      
      {editable && editor.isActive('link') && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center space-x-2 bg-white p-2 rounded shadow-lg border">
            <input
              type="text"
              value={editor.getAttributes('link').href || ''}
              onChange={(e) => editor.chain().focus().setLink({ href: e.target.value }).run()}
              placeholder="Enter URL"
              className="text-sm border rounded px-2 py-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove link"
            >
              Remove
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
