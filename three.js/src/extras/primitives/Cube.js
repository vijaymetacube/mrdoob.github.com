/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

var Cube = function ( width, height, depth, segments_width, segments_height, materials, flipped ) {

	THREE.Geometry.call( this );

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2,
	flip = flipped !== undefined ? - 1 : 1;

	if ( materials !== undefined ) {

		if ( materials instanceof Array ) {

			this.materials = materials;

		} else {

			this.materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				this.materials.push( [ materials ] );

			}

		}

	} else {

		this.materials = [];

	}

	buildPlane( 'z', 'y', - 1 * flip, - 1, depth, height, width_half, this.materials[ 0 ] ); // right
	buildPlane( 'z', 'y',   1 * flip, - 1, depth, height, - width_half, this.materials[ 1 ] ); // left
	buildPlane( 'x', 'z', - 1 * flip, - 1, width, depth, height_half, this.materials[ 2 ] ); // top
	buildPlane( 'x', 'z', - 1 * flip,   1, width, depth, - height_half, this.materials[ 3 ] ); // bottom
	buildPlane( 'x', 'y',   1 * flip, - 1, width, height, depth_half, this.materials[ 4 ] ); // front
	buildPlane( 'x', 'y', - 1 * flip, - 1, width, height, - depth_half, this.materials[ 5 ] ); // back

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var gridX = segments_width || 1,
		gridY = segments_height || 1,
		gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		offset = scope.vertices.length, w;

		if ( ( u == 'x' && v == 'y' ) || ( u == 'y' && v == 'x' ) ) {

			w = 'z';

		} else if ( ( u == 'x' && v == 'z' ) || ( u == 'z' && v == 'x' ) ) {

			w = 'y';

		} else if ( ( u == 'z' && v == 'y' ) || ( u == 'y' && v == 'z' ) ) {

			w = 'x';

		}


		for( iy = 0; iy < gridY1; iy++ ) {

			for( ix = 0; ix < gridX1; ix++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for( iy = 0; iy < gridY; iy++ ) {

			for( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				scope.faces.push( new THREE.Face4( a + offset, b + offset, c + offset, d + offset, null, material ) );
				scope.uvs.push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}

	this.computeCentroids();
	this.computeNormals();

}

Cube.prototype = new THREE.Geometry();
Cube.prototype.constructor = Cube;