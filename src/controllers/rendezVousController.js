import prisma from '../config/database.js';

const rendezVousController = {
  // Créer un rendez-vous
  createRendezVous: async (req, res) => {
    const { date, status, utilisateurId, patientId, medecinId } = req.body;

    try {
      // Vérifier si l'utilisateur, le patient, et le médecin existent
      const utilisateur = await prisma.utilisateurs.findUnique({
        where: { id: utilisateurId }
      });
      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const patient = await prisma.patients.findUnique({
        where: { id: patientId }
      });
      if (!patient) {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }

      const medecin = await prisma.utilisateurs.findUnique({
        where: { id: medecinId }
      });
      if (!medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }

      // Créer le rendez-vous
      const newRendezVous = await prisma.rendezVous.create({
        data: {
          date: new Date(date),
          status,
          utilisateur: { connect: { id: utilisateurId } },
          patient: { connect: { id: patientId } },
          medecin: { connect: { id: medecinId } }
        }
      });
      
      return res.status(201).json({
        message: 'Rendez-vous créé avec succès',
        rendezvous: newRendezVous
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la création du rendez-vous',
        error: error.message
      });
    }
  },

  // Mettre à jour un rendez-vous
  updateRendezVous: async (req, res) => {
    const { id } = req.params;
    const { date, status, medecinId } = req.body;

    try {
      // Vérifier si le rendez-vous existe
      const existingRendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existingRendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      // Mettre à jour le rendez-vous
      const updatedRendezVous = await prisma.rendezVous.update({
        where: { id: parseInt(id) },
        data: {
          date: date ? new Date(date) : undefined,
          status: status || existingRendezVous.status,
          medecin: medecinId ? { connect: { id: medecinId } } : undefined
        }
      });
      
      return res.status(200).json({
        message: 'Rendez-vous mis à jour avec succès',
        rendezvous: updatedRendezVous
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la mise à jour du rendez-vous',
        error: error.message
      });
    }
  },

  // Supprimer un rendez-vous
  deleteRendezVous: async (req, res) => {
    const { id } = req.params;

    try {
      const existingRendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existingRendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      await prisma.rendezVous.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).json({ message: 'Rendez-vous supprimé' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la suppression du rendez-vous',
        error: error.message
      });
    }
  },

  // Obtenir un rendez-vous par ID
  getRendezVousById: async (req, res) => {
    const { id } = req.params;

    try {
      const rendezVous = await prisma.rendezVous.findUnique({
        where: { id: parseInt(id) },
        include: {
          utilisateur: true,
          patient: true,
          medecin: true
        }
      });
      if (!rendezVous) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      res.status(200).json(rendezVous);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la récupération du rendez-vous',
        error: error.message
      });
    }
  },

  // Liste de tous les rendez-vous
  getAllRendezVous: async (req, res) => {
    try {
      const rendezVous = await prisma.rendezVous.findMany({
        include: {
          utilisateur: true,
          patient: true,
          medecin: true
        }
      });
      res.status(200).json(rendezVous);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erreur lors de la récupération des rendez-vous',
        error: error.message
      });
    }
  }
};

export default rendezVousController;
