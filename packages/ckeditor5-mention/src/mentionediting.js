/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module mention/mentionediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * The mention editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MentionEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MentionEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.conversion.for( 'upcast' ).elementToAttribute( {
			view: {
				name: 'span',
				key: 'data-mention',
				classes: 'mention'
			},
			model: {
				key: 'mention',
				value: viewItem => {
					return viewItem.getAttribute( 'data-mention' );
				}
			}
		} );

		editor.conversion.for( 'downcast' ).attributeToElement( {
			model: 'mention',
			view: ( modelAttributeValue, viewWriter ) => {
				return viewWriter.createAttributeElement( 'span', {
					class: 'mention',
					'data-mention': modelAttributeValue
				} );
			}
		} );

		// Allow fontSize attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: 'mention' } );

		// Remove mention attribute if text was edited.
		editor.model.document.registerPostFixer( writer => {
			const changes = editor.model.document.differ.getChanges();

			for ( const change of changes ) {
				if ( change.name == '$text' && change.position.textNode.hasAttribute( 'mention' ) ) {
					writer.removeAttribute( 'mention', change.position.textNode );
				}
			}
		} );
	}
}
