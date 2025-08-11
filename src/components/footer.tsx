import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Shield, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center font-inter">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Catcher
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              A secure platform to register your valuables and help prevent the purchase of stolen items.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Register Item
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Search Registry
                </Link>
              </li>
              <li>
                <Link to="/my-items" className="text-muted-foreground hover:text-primary transition-colors">
                  My Items
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Contact Information</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Plot 1247 Victoria Island Lagos</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+2349135819955</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>support@catcher.com.ng</span>
              </div>
              <div className="flex space-x-4 pt-2">
                <a 
                  href="https://www.facebook.com/share/1EpJ53t6oU/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/catchertechglobal?igsh=OG9mYnBsYmZ4d3Zu" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Catcher. All rights reserved.</p>
          {/* {new Date() > new Date('2025-08-09') && (
            <p className="mt-1">This is a demo application. Items registered here are not stored permanently.</p>
          )} */}
        </div>
      </div>
    </footer>
  );
}