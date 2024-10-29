'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">dabubble documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AddUserToChannelComponent.html" data-type="entity-link" >AddUserToChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelChatAreaComponent.html" data-type="entity-link" >ChannelChatAreaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelComponent.html" data-type="entity-link" >ChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelHeaderComponent.html" data-type="entity-link" >ChannelHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelMessageInputComponent.html" data-type="entity-link" >ChannelMessageInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelUserlistComponent.html" data-type="entity-link" >ChannelUserlistComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateChannelComponent.html" data-type="entity-link" >CreateChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DirectMessagesChatAreaComponent.html" data-type="entity-link" >DirectMessagesChatAreaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DirectMessagesComponent.html" data-type="entity-link" >DirectMessagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DirectMessagesHeaderComponent.html" data-type="entity-link" >DirectMessagesHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DirectMessagesMessageInputComponent.html" data-type="entity-link" >DirectMessagesMessageInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditChannelComponent.html" data-type="entity-link" >EditChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditProfilComponent.html" data-type="entity-link" >EditProfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditProfilContactformComponent.html" data-type="entity-link" >EditProfilContactformComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImpressumComponent.html" data-type="entity-link" >ImpressumComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogInComponent.html" data-type="entity-link" >LogInComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMessageComponent.html" data-type="entity-link" >NewMessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMessageHeaderComponent.html" data-type="entity-link" >NewMessageHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMessageInputComponent.html" data-type="entity-link" >NewMessageInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMessageSearchResultsComponent.html" data-type="entity-link" >NewMessageSearchResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OpenImgComponent.html" data-type="entity-link" >OpenImgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OpenSidebarComponent.html" data-type="entity-link" >OpenSidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordResetComponent.html" data-type="entity-link" >PasswordResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" >PrivacyPolicyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfilOptionsPopupComponent.html" data-type="entity-link" >ProfilOptionsPopupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReactionListComponent.html" data-type="entity-link" >ReactionListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchFieldComponent.html" data-type="entity-link" >SearchFieldComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarComponent.html" data-type="entity-link" >SidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignUpComponent.html" data-type="entity-link" >SignUpComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThreadChatAreaComponent.html" data-type="entity-link" >ThreadChatAreaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThreadComponent.html" data-type="entity-link" >ThreadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThreadHeaderComponent.html" data-type="entity-link" >ThreadHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThreadMessageInputComponent.html" data-type="entity-link" >ThreadMessageInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserProfilComponent.html" data-type="entity-link" >UserProfilComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/DirectMessage.html" data-type="entity-link" >DirectMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelSelectionService.html" data-type="entity-link" >ChannelSelectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatAreaService.html" data-type="entity-link" >ChatAreaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DirectMessageSelectionService.html" data-type="entity-link" >DirectMessageSelectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditChannelService.html" data-type="entity-link" >EditChannelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileUploadeService.html" data-type="entity-link" >FileUploadeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NewMessageSelectionService.html" data-type="entity-link" >NewMessageSelectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OnlineService.html" data-type="entity-link" >OnlineService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponsiveService.html" data-type="entity-link" >ResponsiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RevealPasswordService.html" data-type="entity-link" >RevealPasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SaveNewUserService.html" data-type="entity-link" >SaveNewUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidebarService.html" data-type="entity-link" >SidebarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThreadService.html" data-type="entity-link" >ThreadService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInterFace.html" data-type="entity-link" >UserInterFace</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});