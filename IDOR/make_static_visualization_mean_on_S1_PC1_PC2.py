import sys
sys.path.insert(0, '/home/brain/pycortex')
import cortex
import cortex.dataset as dts

ss = [1]
for s in ss:
    subject = 'PRJ1210_SUBJ00' + str(s)
    my_min = -0.05
    my_max = 0.05
    cm='afmhot_inksel'

    ds = dts.Dataset()
    sid = 'S' + str(s)
    if s==7:
        sid = 'S6'    
        
    print sid
    dv1 = cortex.Volume('/home/brain/pycortex/IDOR/images/RESULTS/S' +str(s) + '/train_corr.nii.gz', subject, 'mean6s', description='CORR',  cvthr=0.01, cmap=cm, vmin=0.05, vmax=0.4, interp="trilinear", stim='/data/devel/pycortex_ntt/filestore/colormaps/autumn_blkmin_alpha_2D.png')
    ds.append(CORR=dv1)

    feature_names = ['ZCR', 'CENTROID', 'BRIGHTNESS', 'SPREAD', 'ROLLOFF', 'ENTROPY', 'FLATNESS', 'ROUGHNESS', 'RMS', 'BAND_FLUX_50', 'BAND_FLUX_100', 'BAND_FLUX_200', 'BAND_FLUX_400', 'BAND_FLUX_800', 'BAND_FLUX_1600', 'BAND_FLUX_3200', 'BAND_FLUX_6400', 'BAND_FLUX_12800', 'BAND_FLUX_INF', 'PULSE_CLARITY', 'KEY_CLARITY'];

    for idx, fn in enumerate(feature_names):
        iidx = format(idx+1, '04d')
        dv01 = cortex.Volume('/home/brain/pycortex/IDOR/images/RESULTS/S' +str(s) + '/W_mean_'+iidx+'.nii.gz', subject, 'mean6s', description=fn,  cmap='jet_alpha0', vmin=-0.1, vmax=0.1, priority=idx+1)
        kwargs = {fn: dv01}
        ds.append(**kwargs)
        #print fn

    for k in [1,2]:
        pc = 'PC' + str(k)
        dv1 = cortex.Volume('/home/brain/pycortex/IDOR/images/RESULTS/riS1_1mm_wmean_ws' +pc +'.nii', subject, 'mean6s', description='Mean', vmin=my_min, vmax=my_max, cmap='jet_alpha0',priority=len(feature_names)+k+2)
        kwargs = {pc: dv1}
        #print k
        ds.append(**kwargs)


    import cortex.webgl.view_adapted

    cortex.webgl.view_adapted.make_static('mean_300vx_html' , ds, template='mir.html')


import subprocess
subprocess.call("python /home/brain/pycortex/IDOR/insertButtons.py", shell=True)
#insertButtons()

