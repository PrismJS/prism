import c from './prism-c';
import type { LanguageProto } from '../types';

export default {
	id: 'glsl',
	require: c,
	grammar({ extend }) {
		return extend('c', {
			'keyword': /\b(?:active|asm|atomic_uint|attribute|bool|break|buffer|[ibdu]?vec[234]|case|cast|centroid|class|coherent|common|const|continue|default|discard|d?mat[234](?:x[234])?|do|double|else|enum|extern|external|false|filter|fixed|flat|float|for|fvec[234]|goto|half|highp|hvec[234]|if|[iu]?image[123]D|[iu]?image[12]DArray|[iu]?image2DMS(?:Array)?|[iu]?image2DRect|[iu]?imageBuffer|[iu]?imageCube|[iu]?imageCubeArray|in|inline|inout|input|int|interface|invariant|[iu]?sampler[123]D|[iu]?sampler[12]DArray|[iu]?sampler2DMS(?:Array)?|[iu]?sampler2DRect|[iu]?samplerBuffer|[iu]?samplerCube|[iu]?samplerCubeArray|layout|long|lowp|mediump|namespace|noinline|noperspective|out|output|partition|patch|precise|precision|public|readonly|resource|restrict|return|sample|sampler[12]DArrayShadow|sampler[12]DShadow|sampler2DRectShadow|sampler3DRect|samplerCubeArrayShadow|samplerCubeShadow|shared|short|sizeof|smooth|static|struct|subroutine|superp|switch|template|this|true|typedef|uint|uniform|union|unsigned|using|varying|void|volatile|while|writeonly)\b/
		});
	}
} as LanguageProto<'glsl'>;
