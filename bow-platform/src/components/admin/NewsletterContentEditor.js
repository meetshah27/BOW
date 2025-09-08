import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Image,
  Type,
  Code,
  Quote,
  Undo,
  Redo,
  Eye,
  FileText,
  Mail,
  Monitor,
  Smartphone,
  X,
  Upload,
  Video,
  Crown,
  Star,
  MousePointer,
  ExternalLink,
  Phone,
  MapPin
} from 'lucide-react';
import FileUpload from '../common/FileUpload';

const NewsletterContentEditor = ({ value, onChange, placeholder }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [mediaUploadType, setMediaUploadType] = useState('image'); // 'image' or 'video'
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(value || '');

  useEffect(() => {
    setEditorContent(value || '');
  }, [value]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    if (onChange) {
      onChange({ target: { name: 'content', value: newContent } });
    }
  };

  const insertText = (before, after = '') => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    const newContent = 
      editorContent.substring(0, start) + 
      before + selectedText + after + 
      editorContent.substring(end);
    
    setEditorContent(newContent);
    if (onChange) {
      onChange({ target: { name: 'content', value: newContent } });
    }
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatBold = () => insertText('**', '**');
  const formatItalic = () => insertText('*', '*');
  const formatUnderline = () => insertText('<u>', '</u>');
  const formatCode = () => insertText('`', '`');
  const formatQuote = () => insertText('\n> ', '');
  const formatLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Enter link text:') || url;
      insertText(`[${text}](${url})`);
    }
  };
  
  const formatList = () => insertText('\n- ', '');
  const formatOrderedList = () => insertText('\n1. ', '');
  const formatHeading = (level) => insertText(`\n${'#'.repeat(level)} `, '');

  const openMediaUpload = (type = 'image') => {
    setMediaUploadType(type);
    setShowMediaUpload(true);
  };

  const handleMediaUpload = (fileData) => {
    const alt = prompt('Enter alt text for this media:') || (mediaUploadType === 'video' ? 'Video' : 'Image');
    
    if (mediaUploadType === 'video') {
      // For videos, we can use HTML5 video tag or just link
      const videoHtml = `\n<div style="text-align: center; margin: 20px 0;">
<video controls style="max-width: 100%; height: auto; border-radius: 8px;">
  <source src="${fileData.fileUrl}" type="video/mp4">
  Your email client doesn't support videos. [Watch video](${fileData.fileUrl})
</video>
<p style="font-size: 12px; color: #666; margin-top: 8px;">${alt}</p>
</div>\n`;
      insertText(videoHtml);
    } else {
      // For images, use markdown format
      insertText(`\n![${alt}](${fileData.fileUrl})\n`);
    }
    
    setShowMediaUpload(false);
  };

  const insertBOWLogo = () => {
    setShowLogoUpload(true);
  };

  const handleLogoUpload = (fileData) => {
    const logoSize = prompt('Enter logo size (small/medium/large):', 'medium') || 'medium';
    
    let sizeStyle = '';
    switch(logoSize.toLowerCase()) {
      case 'small':
        sizeStyle = 'width: 80px; height: auto;';
        break;
      case 'large':
        sizeStyle = 'width: 200px; height: auto;';
        break;
      default: // medium
        sizeStyle = 'width: 120px; height: auto;';
    }

    const logoHtml = `\n<div style="text-align: center; margin: 20px auto; width: 100%; display: block;">
<img src="${fileData.fileUrl}" alt="Beats of Washington Logo" style="${sizeStyle} border-radius: 8px; display: block; margin: 0 auto;" />
</div>\n`;
    
    insertText(logoHtml);
    setShowLogoUpload(false);
  };

  const insertQuickLogo = () => {
    // Insert a placeholder logo that users can replace with their actual logo URL
    const logoHtml = `\n<div style="text-align: center; margin: 20px auto; width: 100%; display: block;">
<img src="https://your-s3-bucket.amazonaws.com/bow-logo.png" alt="Beats of Washington Logo" style="width: 120px; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
</div>\n`;
    insertText(logoHtml);
  };

  const insertButton = () => {
    const buttonText = prompt('Enter button text:', 'Register Now') || 'Register Now';
    const buttonUrl = prompt('Enter button URL:', 'https://') || '#';
    const buttonType = prompt('Enter button type (register/donate/learn-more/contact):', 'register') || 'register';
    
    let buttonColor = '';
    let hoverColor = '';
    
    switch(buttonType.toLowerCase()) {
      case 'register':
        buttonColor = 'background: linear-gradient(135deg, #dc2626, #f97316);';
        hoverColor = 'background: linear-gradient(135deg, #b91c1c, #ea580c);';
        break;
      case 'donate':
        buttonColor = 'background: linear-gradient(135deg, #059669, #10b981);';
        hoverColor = 'background: linear-gradient(135deg, #047857, #059669);';
        break;
      case 'learn-more':
        buttonColor = 'background: linear-gradient(135deg, #2563eb, #3b82f6);';
        hoverColor = 'background: linear-gradient(135deg, #1d4ed8, #2563eb);';
        break;
      case 'contact':
        buttonColor = 'background: linear-gradient(135deg, #7c3aed, #a855f7);';
        hoverColor = 'background: linear-gradient(135deg, #6d28d9, #9333ea);';
        break;
      default:
        buttonColor = 'background: linear-gradient(135deg, #dc2626, #f97316);';
        hoverColor = 'background: linear-gradient(135deg, #b91c1c, #ea580c);';
    }

    const buttonHtml = `\n<div style="text-align: center; margin: 20px 0;">
<a href="${buttonUrl}" style="display: inline-block; padding: 12px 24px; ${buttonColor} color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.cssText='display: inline-block; padding: 12px 24px; ${hoverColor} color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2);'" onmouseout="this.style.cssText='display: inline-block; padding: 12px 24px; ${buttonColor} color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;'">${buttonText}</a>
</div>\n`;
    
    insertText(buttonHtml);
  };

  const insertContactFooter = () => {
    const contactHtml = `\n---

<div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
<div style="color: #dc2626; font-size: 18px; font-weight: bold; margin-bottom: 15px;">📞 Contact Us</div>

<div style="margin-bottom: 8px; color: #374151; font-size: 14px;">
<strong>📍 Address:</strong> 9256 225th Way NE, WA 98053
</div>

<div style="margin-bottom: 8px; color: #374151; font-size: 14px;">
<strong>📞 Phone:</strong> <a href="tel:2063699576" style="color: #dc2626; text-decoration: none;">206 369-9576</a>
</div>

<div style="margin-bottom: 15px; color: #374151; font-size: 14px;">
<strong>📧 Email:</strong> <a href="mailto:beatsofredmond@gmail.com" style="color: #dc2626; text-decoration: none;">beatsofredmond@gmail.com</a>
</div>

<div style="color: #6b7280; font-size: 12px; font-style: italic;">
**Follow the Beats** 🎵 | **Celebrate the Culture** 🎭 | **Unite the Community** 🤝
</div>
</div>\n`;
    
    insertText(contactHtml);
  };

  const applyTemplate = (templateType) => {
    let template = '';
    
    switch (templateType) {
      case 'welcome':
        template = `# 🎵 Beats of Washington – Community Newsletter
*${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}*

---

## 🙏 Namaste BOW Family!

We are excited to share the latest updates, upcoming events, and stories that keep our community united through culture, music, and togetherness.

## ✨ This Month's Highlights

🎶 **Upcoming Events** - Navratri nights, Diwali celebrations, and cultural workshops
📰 **Community News** - Member achievements and volunteer spotlights  
🌟 **Special Feature** - Artist spotlight and cultural traditions

---

**Stay Connected with BOW**
- Website: [beatsofwashington.org](https://beatsofwashington.org)
- Follow us on Instagram and Facebook
- Join our WhatsApp community

Together, let's keep the beats alive and celebrate our culture with joy and unity!

With love and cultural pride,
**The BOW Team** 🎭`;
        break;
        
      case 'event':
        template = `# Upcoming Events & Activities

## Featured Event: [Event Name]

**Date**: [Date and Time]
**Location**: [Venue/Online]
**Registration**: [Link or Instructions]

[Event description and why people should attend]

## Other Upcoming Events

### Event 1
- **Date**: [Date]
- **Details**: [Brief description]

### Event 2  
- **Date**: [Date]
- **Details**: [Brief description]

## How to Get Involved

We're always looking for volunteers and participants. Here's how you can help:

1. **Attend our events** - Your presence makes a difference
2. **Spread the word** - Share with friends and family
3. **Volunteer** - Contact us to learn about opportunities

---

*Questions? Reply to this email or contact us at [email]*`;
        break;
        
      case 'impact':
        template = `# Our Impact This Quarter

## By the Numbers

- **[Number]** people served
- **[Number]** volunteer hours contributed  
- **[Number]** programs delivered
- **[Amount]** funds raised

## Success Stories

### Story 1: [Title]
*Share a specific story about someone who benefited from your work*

### Story 2: [Title]  
*Another inspiring story of impact*

## Looking Ahead

Our goals for next quarter:
- [ ] Goal 1
- [ ] Goal 2  
- [ ] Goal 3

## How You Can Help

Your support makes all of this possible. Ways to contribute:

- **Donate**: [Donation link]
- **Volunteer**: [Volunteer signup]
- **Share**: Tell others about our work

Thank you for being part of our mission!`;
        break;
        
      case 'fundraising':
        template = `# Help Us Reach Our Goal!

## Our Current Campaign: [Campaign Name]

**Goal**: $[Amount]
**Raised So Far**: $[Current Amount] ([Percentage]%)
**Deadline**: [Date]

## Why This Matters

[Explain the specific need and impact of donations]

## How Your Donation Helps

- **$25** - [Specific impact]
- **$50** - [Specific impact]  
- **$100** - [Specific impact]
- **$250** - [Specific impact]

## Ways to Give

1. **Online**: [Donation link]
2. **By Mail**: [Mailing address]
3. **By Phone**: [Phone number]

## Donor Spotlight

*Feature a donor and why they give*

## Thank You!

Every donation, no matter the size, makes a real difference. Thank you for your continued support!

---

*Tax-deductible receipts will be sent for all donations*`;
        break;
        
      case 'bow-newsletter':
        template = `# 🎵 Beats of Washington – Community Newsletter
*${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Edition*

<div style="text-align: center; margin: 20px auto; width: 100%; display: block;">
<img src="https://your-s3-bucket.amazonaws.com/bow-logo.png" alt="Beats of Washington Logo" style="width: 120px; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
</div>

---

## 🙏 Namaste BOW Family!

We are excited to share the latest updates, upcoming events, and stories that keep our community united through culture, music, and togetherness.

---

## ✨ This Month's Highlights

🎶 **Upcoming Events** - [Brief mention of key events]  
📰 **Community News** - [Major announcements or achievements]  
🌟 **Special Feature** - [Artist spotlight or cultural focus]

---

## 🌸 Upcoming Events

<div style="text-align: center; margin: 15px auto; width: 100%; display: block;">
<img src="https://your-s3-bucket.amazonaws.com/bow-logo.png" alt="BOW Events" style="width: 80px; height: auto; border-radius: 6px; display: block; margin: 0 auto;" />
</div>

### 🎭 [Event Name] - [Date]
**When**: [Date & Time]  
**Where**: [Venue & Address]  
**What**: [Brief exciting description]  

<div style="text-align: center; margin: 20px 0;">
<a href="https://your-registration-link.com" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #dc2626, #f97316); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Register Now</a>
</div>

![Event Image](https://your-s3-bucket.amazonaws.com/event-image.jpg)

### 🎶 [Another Event] - [Date]
**When**: [Date & Time]  
**Where**: [Venue]  
**What**: [Description]

---

## 🙌 Volunteer & Community Corner

### We Need You! 
We're looking for volunteers for:
- Event setup and coordination
- Social media and marketing
- Cultural program assistance

**Interested?** Contact us at volunteers@beatsofwashington.org

### 👏 Volunteer Appreciation
Special thanks to [Volunteer Names] for their incredible dedication this month!

---

## 🎤 Artist & Member Spotlight

### Featured Artist: [Name]
[2-3 lines about the featured artist, their contribution to BOW, and upcoming performances]

![Artist Photo](https://your-s3-bucket.amazonaws.com/artist-photo.jpg)

---

## 📸 Photo Memories

Here are some beautiful moments from our recent events:

![Event Photo 1](https://your-s3-bucket.amazonaws.com/photo1.jpg)
*Caption: [Event name and brief description]*

![Event Photo 2](https://your-s3-bucket.amazonaws.com/photo2.jpg)
*Caption: [Event name and brief description]*

---

## 🎯 Join Us!

### 🎟️ Register for Our Events
Don't miss our upcoming events!

<div style="text-align: center; margin: 20px 0;">
<a href="https://your-event-registration.com" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #dc2626, #f97316); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Register for Events</a>
</div>

### 🤝 Become a Volunteer
Join our amazing volunteer team and make a difference!

<div style="text-align: center; margin: 20px 0;">
<a href="https://your-volunteer-signup.com" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #059669, #10b981); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Become a Volunteer</a>
</div>

### 📱 Follow Us
- Instagram: [@beatsofwashington](https://instagram.com/beatsofwashington)
- Facebook: [Beats of Washington](https://facebook.com/beatsofwashington)
- Website: [beatsofwashington.org](https://beatsofwashington.org)

---

## 🌺 Until We Meet Again...

Together, let's keep the beats alive and celebrate our culture with joy and unity. Looking forward to seeing you at our upcoming events!

*"Sangam mein shakti hai"* - There is strength in unity 🤝

With love and cultural pride,  
**The Beats of Washington Team** 🎭

---

<div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
<div style="color: #dc2626; font-size: 18px; font-weight: bold; margin-bottom: 15px;">📞 Contact Us</div>

<div style="margin-bottom: 8px; color: #374151; font-size: 14px;">
<strong>📍 Address:</strong> 9256 225th Way NE, WA 98053
</div>

<div style="margin-bottom: 8px; color: #374151; font-size: 14px;">
<strong>📞 Phone:</strong> <a href="tel:2063699576" style="color: #dc2626; text-decoration: none;">206 369-9576</a>
</div>

<div style="margin-bottom: 15px; color: #374151; font-size: 14px;">
<strong>📧 Email:</strong> <a href="mailto:beatsofredmond@gmail.com" style="color: #dc2626; text-decoration: none;">beatsofredmond@gmail.com</a>
</div>

<div style="color: #6b7280; font-size: 12px; font-style: italic;">
**Follow the Beats** 🎵 | **Celebrate the Culture** 🎭 | **Unite the Community** 🤝
</div>
</div>`;
        break;
        
      default:
        template = `# Newsletter Title

## Introduction

Welcome to our newsletter! Here's what's happening this month.

## Section 1

Your content here...

## Section 2

More content here...

## Closing

Thank you for reading!

---

*Contact us: [email] | Visit: [website]*`;
    }
    
    setEditorContent(template);
    setSelectedTemplate(templateType);
    if (onChange) {
      onChange({ target: { name: 'content', value: template } });
    }
  };

  const renderPreview = () => {
    // Simple markdown-to-HTML conversion for preview
    let html = editorContent
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>')
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return { __html: html };
  };

  const renderEmailPreview = () => {
    // Enhanced email-style preview with proper email styling
    let html = editorContent
      // Headers with email-friendly styling
      .replace(/^### (.*$)/gm, '<h3 style="color: #d97706; font-size: 18px; font-weight: bold; margin: 16px 0 8px 0; font-family: Arial, sans-serif;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="color: #dc2626; font-size: 24px; font-weight: bold; margin: 20px 0 12px 0; font-family: Arial, sans-serif;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="color: #dc2626; font-size: 28px; font-weight: bold; margin: 24px 0 16px 0; text-align: center; font-family: Arial, sans-serif; border-bottom: 3px solid #f59e0b; padding-bottom: 10px;">$1</h1>')
      // Bold and italic with colors
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #dc2626; font-weight: bold;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: #d97706; font-style: italic;">$1</em>')
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u style="color: #dc2626; text-decoration: underline;">$1</u>')
      // Code with background
      .replace(/`(.*?)`/g, '<code style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-family: monospace; color: #92400e;">$1</code>')
      // Links with BOW colors
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #dc2626; text-decoration: none; font-weight: bold; border-bottom: 1px solid #dc2626;" target="_blank">$1</a>')
      // Images with better styling
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /></div>')
      // Handle video HTML tags (keep them as-is since they're already styled)
      .replace(/<video([^>]*)>/g, '<video$1 style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">')
      // Lists with cultural styling
      .replace(/^- (.*$)/gm, '<li style="margin: 8px 0; color: #374151; line-height: 1.6;">$1</li>')
      .replace(/(<li.*<\/li>)/gs, '<ul style="margin: 16px 0; padding-left: 20px; list-style-type: none;">$1</ul>')
      .replace(/^\d+\. (.*$)/gm, '<li style="margin: 8px 0; color: #374151; line-height: 1.6;">$1</li>')
      .replace(/(<li.*<\/li>)/gs, '<ol style="margin: 16px 0; padding-left: 20px;">$1</ol>')
      // Quotes with cultural border
      .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #f59e0b; margin: 16px 0; padding: 12px 16px; background-color: #fffbeb; font-style: italic; color: #92400e;">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr style="border: none; border-top: 2px solid #f59e0b; margin: 24px 0; opacity: 0.6;" />')
      // Line breaks with proper spacing
      .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.6; color: #374151; font-family: Arial, sans-serif;">')
      .replace(/\n/g, '<br style="margin: 8px 0;">');

    // Wrap in paragraph tags
    html = '<p style="margin: 16px 0; line-height: 1.6; color: #374151; font-family: Arial, sans-serif;">' + html + '</p>';
    
    return { __html: html };
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Template Selector */}
          <div className="mr-4">
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Choose Template...</option>
              <option value="bow-newsletter">🎵 BOW Newsletter (Recommended)</option>
              <option value="welcome">Welcome Newsletter</option>
              <option value="event">Event Announcement</option>
              <option value="impact">Impact Report</option>
              <option value="fundraising">Fundraising Campaign</option>
            </select>
          </div>

          <div className="w-px h-6 bg-gray-300 mr-2"></div>

          {/* Formatting Buttons */}
          <button
            type="button"
            onClick={formatBold}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={formatItalic}
            className="p-1 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={formatUnderline}
            className="p-1 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={() => formatHeading(1)}
            className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold"
            title="Heading 1"
          >
            H1
          </button>
          
          <button
            type="button"
            onClick={() => formatHeading(2)}
            className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold"
            title="Heading 2"
          >
            H2
          </button>
          
          <button
            type="button"
            onClick={() => formatHeading(3)}
            className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold"
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={formatList}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={formatOrderedList}
            className="p-1 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={formatLink}
            className="p-1 hover:bg-gray-200 rounded"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => openMediaUpload('image')}
            className="p-1 hover:bg-gray-200 rounded bg-green-100 text-green-600"
            title="Upload Image from S3"
          >
            <Image className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => openMediaUpload('video')}
            className="p-1 hover:bg-gray-200 rounded bg-blue-100 text-blue-600"
            title="Upload Video from S3"
          >
            <Video className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={insertBOWLogo}
            className="p-1 hover:bg-gray-200 rounded bg-gradient-to-r from-red-500 to-orange-500 text-white"
            title="Upload BOW Logo"
          >
            <Crown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertQuickLogo}
            className="p-1 hover:bg-gray-200 rounded bg-orange-100 text-orange-600"
            title="Insert Logo Placeholder"
          >
            <Star className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={insertButton}
            className="p-1 hover:bg-gray-200 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            title="Insert Registration/Action Button"
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertContactFooter}
            className="p-1 hover:bg-gray-200 rounded bg-gradient-to-r from-gray-600 to-gray-700 text-white"
            title="Insert Contact Footer"
          >
            <Phone className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={formatQuote}
            className="p-1 hover:bg-gray-200 rounded"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={formatCode}
            className="p-1 hover:bg-gray-200 rounded"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-1 rounded ${showPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Toggle Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowEmailPreview(true)}
            className="p-1 hover:bg-gray-200 rounded bg-gradient-to-r from-red-500 to-orange-500 text-white"
            title="Email Preview - See how it looks in email"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {showPreview ? (
          <div className="p-4 min-h-96 bg-white prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={renderPreview()} />
          </div>
        ) : (
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={handleContentChange}
            placeholder={placeholder || "Start typing your newsletter content here...\n\nTip: Use the toolbar above for formatting, or choose from our pre-built templates."}
            className="w-full p-4 min-h-96 resize-none border-0 focus:ring-0 focus:outline-none font-mono text-sm"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          />
        )}
      </div>

      {/* Footer with tips */}
        <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div>
            {showPreview ? 'Preview Mode' : 'Editor Mode'} • Supports Markdown formatting • 🎨 Tip: Use emojis for cultural vibes!
          </div>
          <div className="flex items-center space-x-4">
            <span>Characters: {editorContent.length}</span>
            <span>Words: {editorContent.split(/\s+/).filter(word => word.length > 0).length}</span>
          </div>
        </div>
        <div className="mt-1 text-xs text-blue-600">
          💡 S3 Images: Upload images to your S3 bucket and use the image tool above to insert them
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <h3 className="text-xl font-bold">📧 Newsletter Email Preview</h3>
              </div>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="text-white hover:text-gray-200 p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Device Preview Tabs */}
            <div className="bg-gray-100 px-4 py-2 flex space-x-2 border-b">
              <button className="flex items-center space-x-2 px-3 py-1 bg-white rounded shadow text-sm">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:bg-white rounded text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Email Preview Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Newsletter Content with Email Styling */}
              <div 
                className="bg-white border rounded-lg p-6"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.6',
                  color: '#374151',
                  maxWidth: '600px',
                  margin: '0 auto',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div dangerouslySetInnerHTML={renderEmailPreview()} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="text-sm text-gray-600">
                  🎨 This preview shows how your newsletter will appear in email clients
                </div>
                <div className="flex space-x-3 flex-shrink-0">
                  <button
                    onClick={() => setShowEmailPreview(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors whitespace-nowrap"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailPreview(false);
                      // You could add a send test email function here
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded hover:from-red-700 hover:to-orange-700 transition-colors whitespace-nowrap"
                  >
                    Looks Good! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showMediaUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className={`${mediaUploadType === 'video' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                {mediaUploadType === 'video' ? <Video className="w-6 h-6" /> : <Image className="w-6 h-6" />}
                <h3 className="text-xl font-bold">
                  {mediaUploadType === 'video' ? '🎥 Upload Video to Newsletter' : '🖼️ Upload Image to Newsletter'}
                </h3>
              </div>
              <button
                onClick={() => setShowMediaUpload(false)}
                className="text-white hover:text-gray-200 p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {mediaUploadType === 'video' ? 'Select Video File' : 'Select Image File'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {mediaUploadType === 'video' 
                    ? 'Upload a video file to include in your newsletter. Supported formats: MP4, MOV, AVI, WebM'
                    : 'Upload an image file to include in your newsletter. Supported formats: JPG, PNG, GIF, WebP'
                  }
                </p>
              </div>

              <FileUpload
                onUpload={handleMediaUpload}
                onRemove={() => {}}
                folder="newsletter"
                accept={mediaUploadType === 'video' ? 'video/*' : 'image/*'}
                multiple={false}
                maxFiles={1}
                showPreview={true}
                maxSize={mediaUploadType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024} // 100MB for video, 10MB for image
                className="mb-4"
              />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-amber-600 mt-1">💡</div>
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Tips for Newsletter Media:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {mediaUploadType === 'video' ? (
                        <>
                          <li>Keep videos under 30 seconds for better email compatibility</li>
                          <li>Not all email clients support videos - a fallback link will be provided</li>
                          <li>Consider using a thumbnail image with a "Play" button instead</li>
                        </>
                      ) : (
                        <>
                          <li>Use high-quality images (at least 600px wide for newsletters)</li>
                          <li>Optimize file size for faster email loading</li>
                          <li>Add descriptive alt text for accessibility</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Files will be uploaded to your S3 bucket in the 'newsletter' folder
              </div>
              <button
                onClick={() => setShowMediaUpload(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Upload Modal */}
      {showLogoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6" />
                <h3 className="text-xl font-bold">👑 Upload BOW Logo</h3>
              </div>
              <button
                onClick={() => setShowLogoUpload(false)}
                className="text-white hover:text-gray-200 p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Select Your BOW Logo
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your Beats of Washington logo to include in the newsletter. This will be used for branding and section headers.
                </p>
              </div>

              <FileUpload
                onUpload={handleLogoUpload}
                onRemove={() => {}}
                folder="logos"
                accept="image/*"
                multiple={false}
                maxFiles={1}
                showPreview={true}
                isLogo={true}
                maxSize={5 * 1024 * 1024} // 5MB for logos
                className="mb-4"
              />

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-red-600 mt-1">🎨</div>
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Logo Tips for Newsletters:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use PNG format with transparent background for best results</li>
                      <li>Recommended size: 300x300 pixels or larger</li>
                      <li>Keep file size under 1MB for faster email loading</li>
                      <li>High contrast logos work best in email clients</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-amber-600 mt-1">💡</div>
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">After Upload:</p>
                    <p>You'll be prompted to choose logo size (small/medium/large). The logo will be automatically centered for professional appearance in your newsletter.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Logo will be uploaded to your S3 bucket in the 'logos' folder
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoUpload(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertQuickLogo}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                >
                  Use Placeholder Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterContentEditor;
