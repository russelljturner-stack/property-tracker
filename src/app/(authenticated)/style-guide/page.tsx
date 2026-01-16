/**
 * Style Guide Page
 *
 * Visual reference for all UI components and design decisions.
 * Use this to see what styles are available and how they look.
 */

export default function StyleGuidePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1e434d' }}>Style Guide</h1>
        <p className="text-gray-600 mt-2">Visual reference for UI components and design patterns</p>
      </div>

      {/* ============================================================ */}
      {/* COLOUR PALETTE */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Colour Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColourSwatch name="Dark Teal" hex="#1e434d" textLight usage="Primary text, headings, icons on light backgrounds" />
          <ColourSwatch name="Coral" hex="#fa6e60" textLight usage="Accent, CTAs, current stage indicator, page headers" />
          <ColourSwatch name="Brand Yellow" hex="#fff48b" usage="Completed stages, success states, achievements" />
          <ColourSwatch name="Ocean Blue" hex="#0078a0" textLight usage="Sidebar backgrounds, secondary sections" />
          <ColourSwatch name="Vibrant Blue" hex="#007aee" textLight usage="High-emphasis elements, Planning Score" />
          <ColourSwatch name="Grey" hex="#6b7280" textLight usage="Site Context background, muted sections" />
          <ColourSwatch name="Off-white" hex="#f8f8f8" usage="Page background" />
          <ColourSwatch name="White" hex="#ffffff" usage="Cards, content blocks" />
          <ColourSwatch name="Black" hex="#000000" textLight usage="Activity section, high contrast areas" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* TYPOGRAPHY */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Typography</h2>

        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Headings (Montserrat)</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400">h1 - text-3xl font-bold</span>
                <h1 className="text-3xl font-bold" style={{ color: '#1e434d' }}>Page Title Heading</h1>
              </div>
              <div>
                <span className="text-xs text-gray-400">h2 - text-xl font-bold</span>
                <h2 className="text-xl font-bold" style={{ color: '#1e434d' }}>Section Heading</h2>
              </div>
              <div>
                <span className="text-xs text-gray-400">h3 - text-lg font-semibold</span>
                <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Card Heading</h3>
              </div>
              <div>
                <span className="text-xs text-gray-400">h4 - text-base font-semibold</span>
                <h4 className="text-base font-semibold" style={{ color: '#1e434d' }}>Subsection Heading</h4>
              </div>
            </div>
          </div>

          {/* Body Text */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Body Text (Roboto)</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400">text-base - Regular body text</span>
                <p className="text-base" style={{ color: '#1e434d' }}>This is regular body text used for paragraphs and content.</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">text-sm - Smaller body text</span>
                <p className="text-sm" style={{ color: '#1e434d' }}>This is smaller text used for secondary information.</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">text-xs - Caption text</span>
                <p className="text-xs text-gray-500">This is caption text for labels and metadata.</p>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Labels & Section Titles</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400">Section title - uppercase tracking-wider</span>
                <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1e434d' }}>Section Title</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Form label</span>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Form Label</p>
              </div>
            </div>
          </div>

          {/* Text on dark backgrounds */}
          <div className="p-6 shadow" style={{ backgroundColor: '#1e434d', borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">Text on Dark Backgrounds</h3>
            <div className="space-y-2">
              <p className="text-white font-bold">Bold white text</p>
              <p className="text-white">Regular white text</p>
              <p className="text-white/90">White text at 90% opacity</p>
              <p className="text-white/70">White text at 70% opacity (labels)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BUTTONS */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Buttons</h2>

        <div className="space-y-6">
          {/* Primary Buttons */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Primary Buttons (Teal)</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e434d' }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded-full transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e434d' }}
              >
                Pill Button
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded opacity-50 cursor-not-allowed"
                style={{ backgroundColor: '#1e434d' }}
                disabled
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Accent Buttons */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Accent Buttons (Coral)</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded transition-colors hover:opacity-90"
                style={{ backgroundColor: '#fa6e60' }}
              >
                Accent Button
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded-full transition-colors hover:opacity-90"
                style={{ backgroundColor: '#fa6e60' }}
              >
                Pill Button
              </button>
              <button
                className="text-sm font-medium hover:opacity-80"
                style={{ color: '#fa6e60' }}
              >
                + Text Link Button
              </button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Outline Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 text-sm font-medium border rounded transition-colors hover:bg-gray-50"
                style={{ borderColor: '#1e434d', color: '#1e434d' }}
              >
                Outline Teal
              </button>
              <button
                className="px-4 py-2 text-sm font-medium border rounded-full transition-colors hover:bg-gray-50"
                style={{ borderColor: '#fa6e60', color: '#fa6e60' }}
              >
                Outline Coral
              </button>
            </div>
          </div>

          {/* Buttons on Dark Backgrounds */}
          <div className="p-6 shadow" style={{ backgroundColor: '#fa6e60', borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">Buttons on Coral Background</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded-full transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e434d' }}
              >
                Teal on Coral
              </button>
              <button
                className="px-4 py-2 text-sm font-medium border border-white text-white rounded-full transition-colors hover:bg-white/10"
              >
                Outline White
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BADGES & STATUS */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Badges & Status Indicators</h2>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Status Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Active</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">Pending</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Blocked</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">In Progress</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Archived</span>
            </div>
          </div>

          {/* Badges on Dark Background */}
          <div className="p-6 shadow" style={{ backgroundColor: '#fa6e60', borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">Badges on Dark Backgrounds</h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/25 text-white">Status Badge</span>
              <span className="px-2 py-0.5 rounded text-sm bg-white/20 text-white">Type Badge</span>
            </div>
          </div>

          {/* Special Badges */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Special Badges</h3>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Planning Score */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-white rounded-full"
                style={{ backgroundColor: '#007aee' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-semibold">Planning:</span>
                <span className="font-bold">4/5</span>
                <span className="text-xs font-medium opacity-90">(Likely)</span>
              </span>

              {/* Priority badges */}
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">High</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Medium</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Low</span>

              {/* Decision Maker */}
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">★ DM</span>

              {/* NEW badge */}
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">NEW</span>
            </div>
          </div>

          {/* Complete/Current Badges */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Stage Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Complete</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Current</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CARDS & PANELS */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Cards & Panels</h2>

        <div className="space-y-6">
          {/* Standard Card */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Standard Content Card</span>
            <div className="bg-white shadow" style={{ borderRadius: 0 }}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Card Title</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Card content goes here. Cards have no border radius (sharp edges) and use shadow for depth.</p>
              </div>
            </div>
          </div>

          {/* Card with Header Actions */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Card with Header Actions</span>
            <div className="bg-white shadow" style={{ borderRadius: 0 }}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Tasks</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">5 open</span>
                  <button className="text-sm hover:opacity-80" style={{ color: '#fa6e60' }}>+ Add Task</button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Content area</p>
              </div>
            </div>
          </div>

          {/* Coral Header Panel */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Page Header (Coral, Sticky)</span>
            <div className="shadow" style={{ backgroundColor: '#fa6e60', borderRadius: 0 }}>
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/20">
                <h1 className="text-xl font-bold text-white">Page Title</h1>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm border border-white text-white rounded-full hover:bg-white/10">
                    View Site
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#1e434d' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="px-6 py-3 text-sm text-white/90">
                Subtitle or address information
              </div>
            </div>
          </div>

          {/* Grey Context Panel */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Site Context Section (Grey)</span>
            <div className="px-6 py-4" style={{ backgroundColor: '#6b7280', borderRadius: 0 }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-white/90">Site Context</h3>
              <div className="flex gap-3">
                <div className="bg-white/10 rounded flex items-center justify-center text-white/50 text-xs w-[160px] h-[120px]">
                  Map placeholder
                </div>
                <div className="bg-white/10 rounded flex items-center justify-center text-white/50 text-xs w-[160px] h-[120px]">
                  Photo placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Ocean Blue Sidebar */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Sidebar Panel (Ocean Blue)</span>
            <div className="p-4 max-w-xs" style={{ backgroundColor: '#0078a0', borderRadius: 0 }}>
              <div className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1e434d' }}>Sidebar Card</h3>
                <p className="text-sm text-gray-600 mt-2">Cards inside the ocean blue sidebar</p>
              </div>
            </div>
          </div>

          {/* Black Activity Panel */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Activity Section (Black)</span>
            <div className="shadow max-w-md" style={{ backgroundColor: '#000000', borderRadius: 0 }}>
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-white">Activity item with white text</p>
                <p className="text-xs text-white/60 mt-1">User • 2 hours ago</p>
              </div>
            </div>
          </div>

          {/* What's Next Panel */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">What&apos;s Next Prompt (Vibrant Blue)</span>
            <div className="p-4" style={{ backgroundColor: '#007aee', borderRadius: 0 }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">What&apos;s Next</p>
                  <p className="font-semibold text-lg text-white">Action prompt goes here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ICONS */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Icons</h2>

        <div className="space-y-6">
          {/* Icon Style Guide */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Icon Style: SVG Line Icons</h3>
            <p className="text-sm text-gray-600 mb-4">All icons use stroke-based SVGs with strokeWidth=2. Never use filled icons.</p>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Sizes</p>
              <div className="flex items-end gap-6">
                <div className="text-center">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400 mt-1 block">w-5 h-5</span>
                  <span className="text-xs text-gray-400">inline</span>
                </div>
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400 mt-1 block">w-6 h-6</span>
                  <span className="text-xs text-gray-400">feature</span>
                </div>
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400 mt-1 block">w-12 h-12</span>
                  <span className="text-xs text-gray-400">large indicator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Icons on Light Background */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Stage Icons (Dark Teal on Light)</h3>
            <div className="flex gap-6">
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Survey</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Commercial</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Design</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Planning</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Marketing</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M4 21V10l4-4m12 15V10l-4-4M8 6l4-4 4 4M12 2v8M8 21v-6h8v6" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Build</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Live</span>
              </div>
            </div>
          </div>

          {/* Icons on Dark Background */}
          <div className="p-6 shadow" style={{ backgroundColor: '#1e434d', borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">Stage Icons (Coral on Dark)</h3>
            <div className="flex gap-6">
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-white/60 mt-1 block">Commercial</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-xs text-white/60 mt-1 block">Design</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-xs text-white/60 mt-1 block">Planning</span>
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Navigation Icons</h3>
            <div className="flex gap-6">
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Back</span>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Forward</span>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Expand</span>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-xs text-gray-400 mt-1 block">Collapse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FORM ELEMENTS */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Form Elements</h2>

        <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Input */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Text Input</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter text..."
              />
            </div>

            {/* Select */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Select</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            {/* Textarea */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Textarea</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter longer text..."
              />
            </div>

            {/* Checkbox */}
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm" style={{ color: '#1e434d' }}>Checkbox option</span>
              </label>
            </div>

            {/* Radio */}
            <div>
              <label className="flex items-center gap-2">
                <input type="radio" name="radio" className="w-4 h-4 border-gray-300" />
                <span className="text-sm" style={{ color: '#1e434d' }}>Radio option</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROGRESS TIMELINE */}
      {/* ============================================================ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1e434d' }}>Progress Timeline</h2>

        <div className="bg-white p-6 shadow" style={{ borderRadius: 0 }}>
          <div className="flex items-center justify-between">
            {/* Complete stage */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(30, 67, 77, 0.1)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: '#1e434d' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="mt-2 text-xs font-medium" style={{ color: '#1e434d' }}>Complete</span>
            </div>
            <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: '#1e434d' }} />

            {/* Current stage */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center ring-4 ring-[#fa6e60]/30" style={{ backgroundColor: 'rgba(250, 110, 96, 0.15)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="mt-2 text-xs font-medium" style={{ color: '#fa6e60' }}>Current</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gray-200" />

            {/* Future stage */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="mt-2 text-xs font-medium text-gray-400">Future</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// =============================================================================
// Helper Component: Colour Swatch
// =============================================================================
function ColourSwatch({
  name,
  hex,
  usage,
  textLight = false
}: {
  name: string
  hex: string
  usage: string
  textLight?: boolean
}) {
  return (
    <div className="overflow-hidden shadow" style={{ borderRadius: 0 }}>
      <div
        className="h-20 flex items-end p-3"
        style={{ backgroundColor: hex }}
      >
        <span className={`text-sm font-mono ${textLight ? 'text-white' : 'text-gray-900'}`}>
          {hex}
        </span>
      </div>
      <div className="p-3 bg-white">
        <p className="font-medium text-sm" style={{ color: '#1e434d' }}>{name}</p>
        <p className="text-xs text-gray-500 mt-1">{usage}</p>
      </div>
    </div>
  )
}
