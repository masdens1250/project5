import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface LinkProps extends RouterLinkProps {
  variant?: 'default' | 'button' | 'underline';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  external?: boolean;
}

const variants = {
  default: 'text-blue-600 hover:text-blue-800',
  button: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
  underline: 'text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600'
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      variant = 'default',
      icon: Icon,
      iconPosition = 'left',
      external = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const Component = external ? 'a' : RouterLink;
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Component
          ref={ref}
          className={`
            inline-flex items-center gap-2 transition-all duration-200
            ${variants[variant]}
            ${className}
          `}
          {...externalProps}
          {...props}
        >
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </Component>
      </motion.div>
    );
  }
);

Link.displayName = 'Link';