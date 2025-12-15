// 'use client';
// import Link from "next/link";
// import WVlogo from "../assets/YUCHII LOGO.png"
// import Image from 'next/image';

// const Footer = () => {

//     const MailIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const PhoneIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.22003 11.045C9.35772 11.1082 9.51283 11.1227 9.65983 11.086C9.80682 11.0493 9.93692 10.9636 10.0287 10.843L10.2654 10.533C10.3896 10.3674 10.5506 10.233 10.7357 10.1404C10.9209 10.0479 11.125 9.99967 11.332 9.99967H13.332C13.6857 9.99967 14.0248 10.1402 14.2748 10.3902C14.5249 10.6402 14.6654 10.9794 14.6654 11.333V13.333C14.6654 13.6866 14.5249 14.0258 14.2748 14.2758C14.0248 14.5259 13.6857 14.6663 13.332 14.6663C10.1494 14.6663 7.09719 13.4021 4.84675 11.1516C2.59631 8.90119 1.33203 5.84894 1.33203 2.66634C1.33203 2.31272 1.47251 1.97358 1.72256 1.72353C1.9726 1.47348 2.31174 1.33301 2.66536 1.33301H4.66536C5.01899 1.33301 5.35812 1.47348 5.60817 1.72353C5.85822 1.97358 5.9987 2.31272 5.9987 2.66634V4.66634C5.9987 4.87333 5.9505 5.07749 5.85793 5.26263C5.76536 5.44777 5.63096 5.60881 5.46536 5.73301L5.15336 5.96701C5.03098 6.06046 4.94471 6.1934 4.90923 6.34324C4.87374 6.49308 4.89122 6.65059 4.9587 6.78901C5.86982 8.63959 7.36831 10.1362 9.22003 11.045Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const MapPinIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M8.0013 8.66634C9.10587 8.66634 10.0013 7.77091 10.0013 6.66634C10.0013 5.56177 9.10587 4.66634 8.0013 4.66634C6.89673 4.66634 6.0013 5.56177 6.0013 6.66634C6.0013 7.77091 6.89673 8.66634 8.0013 8.66634Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.9987 1.66699H12.4987C11.3936 1.66699 10.3338 2.10598 9.55242 2.88738C8.77102 3.66878 8.33203 4.72859 8.33203 5.83366V8.33366H5.83203V11.667H8.33203V18.3337H11.6654V11.667H14.1654L14.9987 8.33366H11.6654V5.83366C11.6654 5.61265 11.7532 5.40068 11.9094 5.2444C12.0657 5.08812 12.2777 5.00033 12.4987 5.00033H14.9987V1.66699Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const InstagramIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.5846 5.41699H14.593M5.83464 1.66699H14.168C16.4692 1.66699 18.3346 3.53247 18.3346 5.83366V14.167C18.3346 16.4682 16.4692 18.3337 14.168 18.3337H5.83464C3.53345 18.3337 1.66797 16.4682 1.66797 14.167V5.83366C1.66797 3.53247 3.53345 1.66699 5.83464 1.66699ZM13.3346 9.47533C13.4375 10.1689 13.319 10.8772 12.9961 11.4995C12.6732 12.1218 12.1623 12.6265 11.536 12.9417C10.9097 13.2569 10.2 13.3667 9.50779 13.2553C8.81557 13.1439 8.1761 12.8171 7.68033 12.3213C7.18457 11.8255 6.85775 11.1861 6.74636 10.4938C6.63497 9.80162 6.74469 9.0919 7.05991 8.46564C7.37512 7.83937 7.87979 7.32844 8.50212 7.00553C9.12445 6.68261 9.83276 6.56415 10.5263 6.66699C11.2337 6.7719 11.8887 7.10154 12.3944 7.60725C12.9001 8.11295 13.2297 8.76789 13.3346 9.47533Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const TwitterIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.3346 3.33368C18.3346 3.33368 17.7513 5.08368 16.668 6.16701C18.0013 14.5003 8.83464 20.5837 1.66797 15.8337C3.5013 15.917 5.33464 15.3337 6.66797 14.167C2.5013 12.917 0.417969 8.00034 2.5013 4.16701C4.33464 6.33368 7.16797 7.58368 10.0013 7.50034C9.2513 4.00034 13.3346 2.00034 15.8346 4.33368C16.7513 4.33368 18.3346 3.33368 18.3346 3.33368Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
//     const LinkedinIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.3346 6.66699C14.6607 6.66699 15.9325 7.19378 16.8702 8.13146C17.8079 9.06914 18.3346 10.3409 18.3346 11.667V17.5003H15.0013V11.667C15.0013 11.225 14.8257 10.801 14.5131 10.4885C14.2006 10.1759 13.7767 10.0003 13.3346 10.0003C12.8926 10.0003 12.4687 10.1759 12.1561 10.4885C11.8436 10.801 11.668 11.225 11.668 11.667V17.5003H8.33464V11.667C8.33464 10.3409 8.86142 9.06914 9.7991 8.13146C10.7368 7.19378 12.0086 6.66699 13.3346 6.66699Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M5.0013 7.50033H1.66797V17.5003H5.0013V7.50033Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M3.33464 5.00033C4.25511 5.00033 5.0013 4.25413 5.0013 3.33366C5.0013 2.41318 4.25511 1.66699 3.33464 1.66699C2.41416 1.66699 1.66797 2.41318 1.66797 3.33366C1.66797 4.25413 2.41416 5.00033 3.33464 5.00033Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)

//     const linkSections = [
//         {
//             title: "PRODUCTS",
//             links: [
//                 { text: "Engine", path: '/', icon: null },
//                 { text: "Air Compressor", path: '/', icon: null },
//                 { text: "Generator", path: '/', icon: null },
//                 { text: "Pumps", path: '/', icon: null },
//                 { text: "Electric Motor", path: '/', icon: null },
//             ]
//         },
//         {
//             title: "WEBSITE",
//             links: [
//                 { text: "Home", path: '/', icon: null },
//                 { text: "Privacy Policy", path: '/', icon: null },
//                 { text: "Contact", path: '/contact', icon: null },
//                 { text: "About Us", path: '/about', icon: null },
//             ]
//         },
//         {
//             title: "CONTACT",
//             links: [
//                 { text: "+1-212-456-789", path: 'tel:+12124567890', icon: PhoneIcon },
//                 { text: "contact@example.com", path: 'mailto:contact@example.com', icon: MailIcon },
//                 { text: "794 Francisco, 94102", path: '/', icon: MapPinIcon }
//             ]
//         }
//     ];

//     const socialIcons = [
//         { icon: FacebookIcon, link: "https://www.facebook.com" },
//         { icon: InstagramIcon, link: "https://www.instagram.com" },
//         { icon: TwitterIcon, link: "https://twitter.com" },
//         { icon: LinkedinIcon, link: "https://www.linkedin.com" },
//     ]

//     return (
//         <footer className="w-full bg-white border-t border-gray-100">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Main Footer Content */}
//                 <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 py-8 sm:py-10 lg:py-12 border-b border-slate-200">
//                     {/* Logo and Description Section - Centered on All Screens */}
//                     <div className="w-full lg:w-auto lg:max-w-[380px] xl:max-w-[410px] flex flex-col items-center">
//                         <Link href="/" className="inline-block mb-4 sm:mb-5 lg:mb-4">
//                             <Image 
//                                 src={WVlogo} 
//                                 alt="WV logo" 
//                                 width={140} 
//                                 height={100} 
//                                 className="object-contain w-[140px] sm:w-[160px] lg:w-[140px] h-auto mx-auto" 
//                             />
//                         </Link>
//                         <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 sm:mb-6 text-center max-w-md lg:max-w-none">
//                             Welcome to Senba Pumps & Motors, your ultimate destination for the latest Pumps and Motors. We bring you the best in innovation — all in one place.
//                         </p>
//                         <div className="flex items-center justify-center gap-2.5 sm:gap-3">
//                             {socialIcons.map((item, i) => (
//                                 <Link 
//                                     href={item.link} 
//                                     key={i} 
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 hover:scale-110 active:scale-95 transition-all duration-200 rounded-full"
//                                     aria-label={`Social media link ${i + 1}`}
//                                 >
//                                     <item.icon />
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Links Grid Section */}
//                     <div className="w-full lg:w-auto lg:flex-1">
//                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-4 xl:gap-6">
//                             {linkSections.map((section, index) => (
//                                 <div 
//                                     key={index} 
//                                     className={`min-w-0 ${index === 2 ? 'col-span-2 sm:col-span-1 lg:col-span-1' : ''}`}
//                                 >
//                                     <h3 className="text-slate-800 text-sm sm:text-base font-semibold mb-3 sm:mb-4 lg:mb-5 text-left">
//                                         {section.title}
//                                     </h3>
//                                     <ul className="space-y-2 sm:space-y-2.5">
//                                         {section.links.map((link, i) => (
//                                             <li key={i}>
//                                                 <Link 
//                                                     href={link.path} 
//                                                     className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 hover:text-slate-800 hover:underline transition-colors duration-200 leading-relaxed group"
//                                                 >
//                                                     {link.icon && (
//                                                         <span className="flex-shrink-0 mt-0.5 text-slate-500 group-hover:text-slate-700 transition-colors">
//                                                             <link.icon />
//                                                         </span>
//                                                     )}
//                                                     <span className="break-words">{link.text}</span>
//                                                 </Link>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom Copyright Section */}
//                 <div className="py-4 sm:py-5 flex items-center justify-center">
//                     <p className="text-xs sm:text-sm text-slate-500 text-center">
//                         Copyright 2025 © Worley Ventures All Right Reserved.
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;

'use client';
import Link from "next/link";
import WVlogo from "../assets/YUCHII LOGO.png"
import Image from 'next/image';

const Footer = () => {

    const MailIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const PhoneIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.22003 11.045C9.35772 11.1082 9.51283 11.1227 9.65983 11.086C9.80682 11.0493 9.93692 10.9636 10.0287 10.843L10.2654 10.533C10.3896 10.3674 10.5506 10.233 10.7357 10.1404C10.9209 10.0479 11.125 9.99967 11.332 9.99967H13.332C13.6857 9.99967 14.0248 10.1402 14.2748 10.3902C14.5249 10.6402 14.6654 10.9794 14.6654 11.333V13.333C14.6654 13.6866 14.5249 14.0258 14.2748 14.2758C14.0248 14.5259 13.6857 14.6663 13.332 14.6663C10.1494 14.6663 7.09719 13.4021 4.84675 11.1516C2.59631 8.90119 1.33203 5.84894 1.33203 2.66634C1.33203 2.31272 1.47251 1.97358 1.72256 1.72353C1.9726 1.47348 2.31174 1.33301 2.66536 1.33301H4.66536C5.01899 1.33301 5.35812 1.47348 5.60817 1.72353C5.85822 1.97358 5.9987 2.31272 5.9987 2.66634V4.66634C5.9987 4.87333 5.9505 5.07749 5.85793 5.26263C5.76536 5.44777 5.63096 5.60881 5.46536 5.73301L5.15336 5.96701C5.03098 6.06046 4.94471 6.1934 4.90923 6.34324C4.87374 6.49308 4.89122 6.65059 4.9587 6.78901C5.86982 8.63959 7.36831 10.1362 9.22003 11.045Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.9987 1.66699H12.4987C11.3936 1.66699 10.3338 2.10598 9.55242 2.88738C8.77102 3.66878 8.33203 4.72859 8.33203 5.83366V8.33366H5.83203V11.667H8.33203V18.3337H11.6654V11.667H14.1654L14.9987 8.33366H11.6654V5.83366C11.6654 5.61265 11.7532 5.40068 11.9094 5.2444C12.0657 5.08812 12.2777 5.00033 12.4987 5.00033H14.9987V1.66699Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const InstagramIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.5846 5.41699H14.593M5.83464 1.66699H14.168C16.4692 1.66699 18.3346 3.53247 18.3346 5.83366V14.167C18.3346 16.4682 16.4692 18.3337 14.168 18.3337H5.83464C3.53345 18.3337 1.66797 16.4682 1.66797 14.167V5.83366C1.66797 3.53247 3.53345 1.66699 5.83464 1.66699ZM13.3346 9.47533C13.4375 10.1689 13.319 10.8772 12.9961 11.4995C12.6732 12.1218 12.1623 12.6265 11.536 12.9417C10.9097 13.2569 10.2 13.3667 9.50779 13.2553C8.81557 13.1439 8.1761 12.8171 7.68033 12.3213C7.18457 11.8255 6.85775 11.1861 6.74636 10.4938C6.63497 9.80162 6.74469 9.0919 7.05991 8.46564C7.37512 7.83937 7.87979 7.32844 8.50212 7.00553C9.12445 6.68261 9.83276 6.56415 10.5263 6.66699C11.2337 6.7719 11.8887 7.10154 12.3944 7.60725C12.9001 8.11295 13.2297 8.76789 13.3346 9.47533Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const TwitterIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.3346 3.33368C18.3346 3.33368 17.7513 5.08368 16.668 6.16701C18.0013 14.5003 8.83464 20.5837 1.66797 15.8337C3.5013 15.917 5.33464 15.3337 6.66797 14.167C2.5013 12.917 0.417969 8.00034 2.5013 4.16701C4.33464 6.33368 7.16797 7.58368 10.0013 7.50034C9.2513 4.00034 13.3346 2.00034 15.8346 4.33368C16.7513 4.33368 18.3346 3.33368 18.3346 3.33368Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const YoutubeIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.15 5.8C19 5.2 18.6 4.7 18 4.5C16.5 4 10 4 10 4C10 4 3.5 4 2 4.5C1.4 4.7 1 5.2 0.85 5.8C0.5 7.5 0.5 10 0.5 10C0.5 10 0.5 12.5 0.85 14.2C1 14.8 1.4 15.3 2 15.5C3.5 16 10 16 10 16C10 16 16.5 16 18 15.5C18.6 15.3 19 14.8 19.15 14.2C19.5 12.5 19.5 10 19.5 10C19.5 10 19.5 7.5 19.15 5.8ZM8 12.5V7.5L13 10L8 12.5Z" fill="currentColor"/></svg>)

    const aboutSection = {
        title: "ABOUT MACHINE DIRECT",
        description: "Machine Direct is one of the leading suppliers of power equipment and garden machinery in the UK. We stock a wide range of products from world renowned brands such as Hyundai, JCB, Belle and more.",
        contact: {
            title: "CONTACT US:",
            phone: "+44(0)1884 799202",
            emails: ["sales@machinedirect.co.uk", "support@machinedirect.co.uk"]
        }
    };

    const keyInfoLinks = [
        { text: "Delivery", path: '/delivery' },
        { text: "Returns", path: '/returns' },
        { text: "Warranty", path: '/warranty' },
        { text: "FAQ", path: '/faq' },
        { text: "Finance", path: '/finance' },
        { text: "Customer Reviews", path: '/reviews' },
        { text: "Terms & Conditions", path: '/terms' },
        { text: "Business Terms", path: '/business-terms' },
        { text: "Privacy Policy", path: '/privacy' },
        { text: "Contact", path: '/contact' }
    ];

    const socialIcons = [
        { icon: FacebookIcon, link: "https://www.facebook.com", label: "Facebook" },
        { icon: TwitterIcon, link: "https://twitter.com", label: "Twitter" },
        { icon: InstagramIcon, link: "https://www.instagram.com", label: "Instagram" },
        { icon: YoutubeIcon, link: "https://www.youtube.com", label: "YouTube" },
    ];

    const paymentMethods = [
        { name: "American Express", img: "/payment/amex.svg" },
        { name: "Apple Pay", img: "/payment/apple-pay.svg" },
        { name: "Diners Club", img: "/payment/diners.svg" },
        { name: "Discover", img: "/payment/discover.svg" },
        { name: "Google Pay", img: "/payment/google-pay.svg" },
        { name: "Klarna", img: "/payment/klarna.svg" },
        { name: "Maestro", img: "/payment/maestro.svg" },
        { name: "Mastercard", img: "/payment/mastercard.svg" },
        { name: "Shop Pay", img: "/payment/shop-pay.svg" },
        { name: "Union Pay", img: "/payment/union-pay.svg" },
        { name: "Visa", img: "/payment/visa.svg" },
    ];

    return (
        <footer className="w-full bg-slate-50 border-t border-gray-100">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* About Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-slate-800 text-base sm:text-lg font-bold mb-4 uppercase tracking-wide">
                            {aboutSection.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            {aboutSection.description}
                        </p>
                        
                        <div className="space-y-3">
                            <h4 className="text-slate-800 text-sm font-bold uppercase tracking-wide">
                                {aboutSection.contact.title}
                            </h4>
                            <div className="space-y-2">
                                <p className="text-slate-600 text-sm">
                                    Expert Advice: <span className="text-slate-800">{aboutSection.contact.phone}</span>
                                </p>
                                <div className="text-slate-600 text-sm">
                                    Email: {aboutSection.contact.emails.map((email, index) => (
                                        <span key={index}>
                                            <Link 
                                                href={`mailto:${email}`}
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                {email}
                                            </Link>
                                            {index < aboutSection.contact.emails.length - 1 && <span className="text-slate-600"> | </span>}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Information Links */}
                    <div className="lg:col-span-1">
                        <h3 className="text-slate-800 text-base sm:text-lg font-bold mb-4 uppercase tracking-wide">
                            KEY INFORMATION
                        </h3>
                        <ul className="space-y-2.5">
                            {keyInfoLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.path}
                                        className="text-slate-600 hover:text-slate-800 hover:underline text-sm transition-colors duration-200"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-slate-800 text-base sm:text-lg font-bold mb-4 uppercase tracking-wide">
                            GET EXCLUSIVE DISCOUNTS
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            Subscribe and get exclusive discounts and offers sent direct to your inbox.
                        </p>
                        
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-3 bg-white border border-gray-300 text-slate-900 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white text-sm font-semibold rounded transition-colors duration-200"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        
                        {/* Copyright */}
                        <div className="text-slate-500 text-sm text-center lg:text-left">
                            © 2025 Machine Direct
                        </div>

                        {/* Social Icons */}
                        <div className="order-first lg:order-none">
                            <p className="text-slate-600 text-sm mb-3 text-center">Follow Us</p>
                            <div className="flex items-center justify-center gap-3">
                                {socialIcons.map((item, i) => (
                                    <Link 
                                        href={item.link} 
                                        key={i} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-200 rounded-full"
                                        aria-label={item.label}
                                    >
                                        <item.icon />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <p className="text-slate-600 text-sm mb-3 text-center lg:text-right">We Accept</p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
                                {paymentMethods.map((method, i) => (
                                    <div 
                                        key={i}
                                        className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center p-1"
                                        title={method.name}
                                    >
                                        {/* Payment icon placeholder - replace with actual payment icons */}
                                        <div className="text-[8px] text-slate-600 font-bold text-center leading-tight">
                                            {method.name.split(' ').map(word => word[0]).join('')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;