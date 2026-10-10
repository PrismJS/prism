/**
 * The version of Prism, such as `2.0.0`. The build fills it in, so unbuilt source has `dev`.
 */
export const version = /* version_placeholder[ */ 'dev'; /* ] */

/**
 * Whether a copy of Prism with the `other` version can share the global instance and its registry with this copy.
 * Only the same major version can, and unbuilt source (`dev`) matches any version.
 *
 * @param {string} other
 */
export function isCompatible (other) {
	return other === 'dev' || version === 'dev' || parseInt(other) === parseInt(version);
}
