import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation } from 'react-router-dom';

import PMTopbar from './PMTopBar';
import AppFooter from './AppFooter';
import AppBreadcrumb from './AppBreadcrumb';

import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Procedures from './pages/Procedures';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/Invoices/create';
import UpdateInvoice from './pages/Invoices/update_invoice';
import PrintInvoice from './pages/Invoices/print_invoice';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';

const App = () => {
    const [menuActive, setMenuActive] = useState(false);
    const [menuMode, setMenuMode] = useState('static');
    const [colorScheme, setColorScheme] = useState('light');
    const [menuTheme, setMenuTheme] = useState('layout-sidebar-darkgray');
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [topbarUserMenuActive, setTopbarUserMenuActive] = useState(false);
    const [topbarNotificationMenuActive, setTopbarNotificationMenuActive] = useState(false);
    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [configActive, setConfigActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [logoColor, setLogoColor] = useState('white');
    const [componentTheme, setComponentTheme] = useState('blue');
    const [logoUrl, setLogoUrl] = useState('assets/layout/images/logo-dark.svg');
    const copyTooltipRef = useRef();
    const location = useLocation();

    let menuClick = false;
    let searchClick = false;
    let userMenuClick = false;
    let notificationMenuClick = false;
    let rightMenuClick = false;
    let configClick = false;

    const breadcrumb = [
        { path: '/invoices', parent: 'Menu', label: 'Invoices' },
        { path: '/invoices/create', parent: 'Invoices', label: 'Create Invoice' },
        { path: '/invoices/update', parent: 'Invoices', label: 'Update Invoice' },
        { path: '/invoices/print', parent: 'Invoices', label: 'Print Invoice' },
        { path: '/doctors', parent: 'Menu', label: 'Doctors' },
        { path: '/procedures', parent: 'Menu', label: 'Procedures' },
        { path: '/patients', parent: 'Menu', label: 'Patients' },
    ];

    const menu = [
        {
            label: 'Menu',
            icon: 'pi pi-fw pi-home',
            items: [
                // { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Patients', icon: 'pi pi-fw pi-user', to: '/patients' },
                { label: 'Doctors', icon: 'pi pi-fw pi-user', to: '/doctors' },
                { label: 'Procedures', icon: 'pi pi-fw pi-list', to: '/procedures' },
                {
                    label: 'Invoices', icon: 'pi pi-fw pi-dollar', to: '/invoices',
                    // items: [
                    //     { label: 'View Invoices', icon: 'pi pi-fw pi-dollar', to: '/invoices' },
                    //     { label: 'Create Invoice', icon: 'pi pi-fw pi-dollar', to: '/invoices/create' },
                    // ],
                }
            ]
        },
    ]

    let meta = breadcrumb.find((obj) => {
        return obj.path === location.pathname;
    });

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onDocumentClick = () => {
        if (!searchClick && searchActive) {
            onSearchHide();
        }

        if (!userMenuClick) {
            setTopbarUserMenuActive(false);
        }

        if (!notificationMenuClick) {
            setTopbarNotificationMenuActive(false);
        }

        if (!rightMenuClick) {
            setRightMenuActive(false);
        }

        if (!menuClick) {
            if (isSlim() || isHorizontal()) {
                setMenuActive(false);
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                hideOverlayMenu();
            }

            unblockBodyScroll();
        }

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        searchClick = false;
        configClick = false;
        userMenuClick = false;
        rightMenuClick = false;
        notificationMenuClick = false;
        menuClick = false;
    };

    const onMenuClick = () => {
        menuClick = true;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        setTopbarUserMenuActive(false);
        setTopbarNotificationMenuActive(false);
        setRightMenuActive(false);

        if (isOverlay()) {
            setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive);
        }

        if (isDesktop()) {
            setStaticMenuDesktopInactive((prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive);
        } else {
            setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive);
        }

        event.preventDefault();
    };

    const onMenuitemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();

            if (isSlim() || isHorizontal()) {
                setMenuActive(false);
            }
        }
    };

    const onRootMenuitemClick = () => {
        setMenuActive((prevMenuActive) => !prevMenuActive);
    };

    const onTopbarUserMenuButtonClick = (event) => {
        userMenuClick = true;
        setTopbarUserMenuActive((prevTopbarUserMenuActive) => !prevTopbarUserMenuActive);

        hideOverlayMenu();

        event.preventDefault();
    };

    const onTopbarNotificationMenuButtonClick = (event) => {
        notificationMenuClick = true;
        setTopbarNotificationMenuActive((prevTopbarNotificationMenuActive) => !prevTopbarNotificationMenuActive);

        hideOverlayMenu();

        event.preventDefault();
    };

    const toggleSearch = () => {
        setSearchActive((prevSearchActive) => !prevSearchActive);
        searchClick = true;
    };

    const onSearchHide = () => {
        setSearchActive(false);
        searchClick = false;
    };

    const onRightMenuButtonClick = (event) => {
        rightMenuClick = true;
        setRightMenuActive((prevRightMenuActive) => !prevRightMenuActive);
        hideOverlayMenu();
        event.preventDefault();
    };

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false);
        setStaticMenuMobileActive(false);
        unblockBodyScroll();
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    const isSlim = () => {
        return menuMode === 'slim';
    };

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    };

    const isOverlay = () => {
        return menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 1091;
    };

    const containerClassName = classNames(
        'layout-wrapper',
        {
            'layout-overlay': menuMode === 'overlay',
            'layout-static': menuMode === 'static',
            'layout-slim': menuMode === 'slim',
            'layout-horizontal': menuMode === 'horizontal',
            'layout-sidebar-dim': colorScheme === 'dim',
            'layout-sidebar-dark': colorScheme === 'dark',
            'layout-overlay-active': overlayMenuActive,
            'layout-mobile-active': staticMenuMobileActive,
            'layout-static-inactive': staticMenuDesktopInactive && menuMode === 'static',
            'p-input-filled': inputStyle === 'filled',
            'p-ripple-disabled': !ripple
        },
        colorScheme === 'light' ? menuTheme : ''
    );

    return (
        <div className={containerClassName} data-theme={colorScheme} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <div className="layout-content-wrapper">
                <PMTopbar
                    meta={meta}
                    topbarNotificationMenuActive={topbarNotificationMenuActive}
                    topbarUserMenuActive={topbarUserMenuActive}
                    onMenuButtonClick={onMenuButtonClick}
                    onSearchClick={toggleSearch}
                    onTopbarNotification={onTopbarNotificationMenuButtonClick}
                    onTopbarUserMenu={onTopbarUserMenuButtonClick}
                    onRightMenuClick={onRightMenuButtonClick}
                    onRightMenuButtonClick={onRightMenuButtonClick}
                    menu={menu}
                    menuMode={menuMode}
                    menuActive={menuActive}
                    staticMenuMobileActive={staticMenuMobileActive}
                    onMenuClick={onMenuClick}
                    onMenuitemClick={onMenuitemClick}
                    onRootMenuitemClick={onRootMenuitemClick}
                ></PMTopbar>

                <div className="layout-content">
                    <div className="layout-breadcrumb viewname" style={{ textTransform: 'uppercase' }}>
                        <AppBreadcrumb meta={meta} />
                    </div>
                    <Routes>
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/invoices/create" element={<CreateInvoice />} />
                        <Route path="/invoices/update" element={<UpdateInvoice />} />
                        <Route path="/invoices/print" element={<PrintInvoice />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/procedures" element={<Procedures />} />
                        <Route path="/doctors" element={<Doctors />} />
                    </Routes>
                </div>

                <AppFooter />
            </div>
        </div>
    );
};

export default App;
