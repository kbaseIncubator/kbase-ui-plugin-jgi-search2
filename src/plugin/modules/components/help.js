define([
    'knockout-plus',
    'kb_common/html'
], function(
    ko,
    html
) {
    'use strict';
    var t = html.tag,
        div = t('div'),
        a = t('a'),
        ul = t('ul'),
        li = t('li'),
        p = t('p');

    function viewModel(params) {
        var helpDb = params.helpDb;

        var topicsIndex = {};
        helpDb.topics.forEach(function(topic) {
            topicsIndex[topic.id] = topic;
        });

        var currentTopicId = ko.observable();

        var currentTopic = ko.observable();

        currentTopicId.subscribe(function() {
            currentTopic(topicsIndex[currentTopicId()]);
        });

        // ACTIONS
        function doSelectTopic(topic) {
            currentTopicId(topic.id);
        }

        currentTopicId(params.topic || 'overview');

        return {
            topics: helpDb.topics,
            references: helpDb.references,
            currentTopicId: currentTopicId,
            doSelectTopic: doSelectTopic,
            currentTopic: currentTopic
        };
    }

    function template() {
        return div({
            class: 'component-help'
        }, [
            div({
                class: '-index'
            }, [
                div({
                    style: {
                        fontWeight: 'bold'
                    }
                }),
                ul({
                    dataBind: {
                        foreach: 'topics'
                    }
                }, li(a({
                    dataBind: {
                        text: 'title',
                        click: '$component.doSelectTopic',
                        css: {
                            '-active': 'id === $component.currentTopicId()'
                        }
                    },
                    class: '-item'
                })))
            ]),
            div({
                dataBind: {
                    with: 'currentTopic'
                },
                class: '-body'
            }, [
                div({
                    dataBind: {
                        text: 'title'
                    },
                    class: '-title'
                }),
                div({
                    dataBind: {
                        foreach: 'content'
                    },
                    class: '-content'
                }, p({
                    dataBind: {
                        text: '$data'
                    }
                }))
            ]),
            '<!-- ko if: $data.references && references.length > 0 -->',
            div({
                class: '-references'
            }, [
                div({
                    class: '-title'
                }, 'References'),
                ul({
                    dataBind: {
                        foreach: 'references'
                    }
                }, a({
                    dataBind: {
                        attr: {
                            href: 'url',
                            target: 'external ? "_blank" : ""'
                        },
                        text: 'title'
                    }
                }))
            ]),
            '<!-- /ko -->'
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }
    ko.components.register('help', component());
});