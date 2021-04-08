apt-get update -y
apt-get upgrade -y
apt-get install -y build-essential git ipython ipython-notebook libav-tools libfreetype6 libfreetype6-dev libsamplerate0 libsamplerate0-dev libssl-dev mongodb pkg-config python-dev python-matplotlib python-nose python-numpy python-pandas python-pip python-scipy python-sympy
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y build-essential libssl-dev python-pip python-dev libfreetype6 libfreetype6-dev pkg-config python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose libsamplerate0 libsamplerate0-dev libav-tools git mongodb nodejs
cd node
sudo npm install
cd ..
cd python
pip install -r requirements.txt
