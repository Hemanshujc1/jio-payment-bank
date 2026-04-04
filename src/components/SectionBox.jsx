import React from 'react';

const SectionBox = ({ title, children }) => {
  return (
    <section className="w-full mb-8">
      {title && (
        <h2 className="text-[22px] font-bold text-sand-900 mb-4 pl-2">
          {title}
        </h2>
      )}
      {/* A large white container with rounded corners and a slight shadow */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-light/30 min-h-87.5 w-full max-w-125">
        <div className="flex flex-wrap gap-8 items-start">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionBox;
