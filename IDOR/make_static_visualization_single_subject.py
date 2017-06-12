import sys
sys.path.insert(0, '/home/brain/pycortex')
import cortex
import cortex.dataset as dts

ss = [5]
for s in ss:
	subject = 'PRJ1210_SUBJ00' + str(s)
	my_min = -0.1
	my_max = 0.1
	cm='afmhot_inksel'

	ds = dts.Dataset()

	dv1 = cortex.Volume('/home/brain/pycortex/IDOR/images/RESULTS/S' + str(s) + 'W_mean_PC1best300voxels_Applied2All.nii.gz', subject, 'fullhead', description='PC1', vmin=my_min, vmax=my_max, cmap='RdBu_r')
	fn = 'S' + str(s)	
	kwargs = {fn: dv1}
	ds.append(**kwargs)


	import cortex.webgl.view_adapted

	cortex.webgl.view_adapted.make_static('S' + str(s) + '_meanPC1_300vx_html' , ds)



