import sys
import librosa

try:
    duration = sys.argv[2]
    y, sr = librosa.load(sys.argv[1])
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    y_harmonic, y_percussive = librosa.effects.hpss(y)
    beats_per_second = sys.argv[3]

    i = 0
    harper_array = []
    for x, y in zip(y_harmonic, y_percussive):
        if i < (int(duration)/1000)*int(beats_per_second):
            harper_array.append(str(int((abs(x) + abs(y)) * 1000)))
            i += 1

    harper = (','.join(harper_array))
    print '{"bpm": ' + str(tempo) + ', "harper": [' + harper + ']}'
except:
    print '{"bpm": 0, "harper": []}'
