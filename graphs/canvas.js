// ====================================
// Objet
// ====================================
function libgraph(c)
{
	this.setBuild(c);
}
libgraph.prototype =
{
	// ====================================
	// Général settings
	// ====================================
	setBuild: function(c)
	{
		// On créer un canvas
		var canvas = document.createElement('canvas');

		// On enregistre le parent et le canvas+contexte
		this.p   = c;
		this.c   = canvas;
		this.ctx = canvas.getContext('2d');
		
		// On définit la taille du canvas
		this.setSize();

		// On ajoute le canvas au parent
		this.p.appendChild(canvas);
	},
	setSize: function()
	{
		// Update width/height this
		this.width  = this.p.clientWidth;
		this.height = this.p.clientHeight;

		// Update attribut width/size tag canvas css
		this.c.width  = this.width;
		this.c.height = this.height;
	},


	// ====================================
	// Tracées
	// ====================================
	newShape: function(t,f)
	{
		// Nouvelle forme
		this.ctx.beginPath();

		// Colors
		this.ctx.fillStyle   = t.backgroundColor ? t.backgroundColor : '#000';
		this.ctx.strokeStyle = t.borderColor     ? t.borderColor     : '#000';

		// Paramètres des lignes
		this.ctx.lineWidth = t.lineWidth ? t.lineWidth : 1;
		this.ctx.lineJoin  = t.lineJoin  ? t.lineJoin  : 'round';

		// Dessin de la forme
		f(this);

		// On termine la forme
		this.ctx.closePath();
	},
	newLine: function(t)
	{
		if(t.pos)
		{
			this.newShape(t, function(x)
			{
				if(t.graph) var last = t.pos[0], base = t.pos[1][0]/2;

				// Placement du premier point
				x.ctx.moveTo(last[0], last[1]);

				// On boucle sur tous les points à partir du deuxième
				for(var i = 1; i < t.pos.length; i++)
				{
					var e = t.pos[i];

					if(!t.graph)
					{
						x.ctx.lineTo(e[0], e[1]);
					}
					else
					{
						x.ctx.bezierCurveTo((last[0]+base), last[1], (e[0]-base), e[1], e[0], e[1]);
						last = e;
					}
				}

				// On définit le type de la forme (fill/stroke : défaut fill)
				var type = t.type && ['fill','stroke'].indexOf(t.type) != -1 ? t.type : 'fill';
				x.ctx[type]();
			});
		}
	},
	newCircle: function(t)
	{
		if(t.pos && t.size)
		{
			// On boucle sur tous les points à partir du deuxième
			for(var i = 0; i < t.pos.length; i++)
			{
				this.newShape(t, function(x)
				{
					// Angles
					var angles = t.angle ? t.angle : [0, Math.PI*2];

					// On trace notre arc
					x.ctx.arc(t.pos[i][0], t.pos[i][1], t.size, angles[0], angles[1]);

					// On définit le type de la forme (fillRect/strokeRect : défaut fillRect)
					var type = t.type && ['fill','stroke'].indexOf(t.type) != -1 ? t.type : 'fill';
					x.ctx[type]();
				});
			}
		}
	},
	newRect: function(t)
	{
		if(t.pos && t.size)
		{
			this.newShape(t, function(x)
			{
				// On définit le type de la forme (fillRect/strokeRect : défaut fillRect)
				var type = t.type && ['fillRect','strokeRect'].indexOf(t.type) != -1 ? t.type : 'fillRect';
				x.ctx[type](t.pos[0], t.pos[1], t.size[0], t.size[1]);
			});
		}
	}
}



// ====================================
// Utilisation
// ====================================
var test = new libgraph(getCanvas);

test.newLine({
				pos: [[0, 300], [150, 0], [300, 300], [0, 300]], // positions [[x,y],[x,y]] [OBLIGATOIRE]
				type: 'stroke', // stroke || fill [Facultatif]
				backgroundColor: '#ff0000', // [Facultatif]
				borderColor: '#00ff00', // [Facultatif]
				lineJoin: 'round', // round || bevel [Facultatif]
				lineWidth: 1 // [Facultatif]
			});
test.newRect({
				pos: [25, 50], // x,y [OBLIGATOIRE]
				size: [200, 100], // width,height [OBLIGATOIRE]
				backgroundColor: '#ff0000', // [Facultatif]
				borderColor: '#00ff00', // [Facultatif]
				type: 'fillRect', // fillRect || strokeRect [Facultatif]
				lineWidth: 1 // [Facultatif]
			});
test.newCircle({
				pos: [50, 50], // x,y [OBLIGATOIRE]
				size: 25, // width,height [OBLIGATOIRE]
				backgroundColor: '#ff0000', // [Facultatif]
				borderColor: '#00ff00', // [Facultatif]
				type: 'stroke', // stroke || fill [Facultatif]
				lineWidth: 3, // [Facultatif]
				angle: [0, Math.PI*2] // start,end [Facultatif]
			});
